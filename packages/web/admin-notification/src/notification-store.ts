import { PriorityQueue, nanoid } from '@skyroc/utils';

import type {
  AddNotificationInput,
  NotificationConfig,
  NotificationItem,
  NotificationPriority,
  NotificationShortcutOptions,
  NotificationSnapshot,
  NotificationStoreOptions
} from './types';

/** 默认的通知运行时配置。 */
export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  browserNotificationEnabled: true,
  doNotDisturb: false,
  maxNotifications: 99,
  soundEnabled: true
};

/** 排序权重，越小越靠前。没标优先级的按 normal 算。 */
const PRIORITY_WEIGHT: Record<NotificationPriority, number> = {
  high: 1,
  low: 3,
  normal: 2,
  urgent: 0
};

/**
 * 队列里额外挂的入队序号。
 *
 * Timestamp 是毫秒，一轮循环推进来的多条会撞成同一个值，只按它排的话顺序由 sort 的实现决定。 序号单调递增，做最后一道 tie-breaker。
 */
type QueuedNotification = NotificationItem & { seq: number };

function getWeight(priority: NotificationPriority | undefined): number {
  return PRIORITY_WEIGHT[priority ?? 'normal'];
}

/** 先按优先级，再按时间倒序（新的在前），最后按入队序号倒序。已读与否不参与排序：否则点一下已读整个列表会跳动。 */
function compareNotifications(a: QueuedNotification, b: QueuedNotification): number {
  return getWeight(a.priority) - getWeight(b.priority) || b.timestamp - a.timestamp || b.seq - a.seq;
}

function getCurrentTimeText(): string {
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');

  return `${hour}:${minute}`;
}

/** 判断时间是否处于指定范围内，同时支持跨午夜的时间段。 */
function isWithinTimeRange(currentTime: string, start: string, end: string): boolean {
  if (start <= end) {
    return currentTime >= start && currentTime <= end;
  }

  return currentTime >= start || currentTime <= end;
}

/**
 * 通知中心的状态与副作用，不依赖 React。
 *
 * 只管三件事：维护去重排序后的通知队列、维护运行时配置、按配置播音效和弹浏览器通知。 消息从哪来（WebSocket、SSE、HTTP 轮询、手动调用）一概不知道 —— 数据源留在宿主应用里， 否则这个包会被绑死在某一套后端协议上。
 *
 * React 侧用 subscribe / getSnapshot 交给 useSyncExternalStore 订阅，见 use-notification.ts。
 */
export class NotificationStore {
  /** 当前运行时配置，唯一真相。 */
  private config: NotificationConfig;

  /** 变更监听器集合，快照重建后统一回调。 */
  private readonly listeners = new Set<() => void>();

  private options: NotificationStoreOptions;

  /** 浏览器原生通知的授权状态。构造时不读，见 syncPermission。 */
  private permission: NotificationPermission = 'default';

  /** Id 去重 + 优先级排序 + 容量上限都在这里，store 自己不再维护第二份列表。 */
  private readonly queue: PriorityQueue<QueuedNotification>;

  /** 入队序号，只增不减。 */
  private seq = 0;

  /** 快照缓存。useSyncExternalStore 按引用比较，每次现算会一直重渲染。 */
  private snapshot: NotificationSnapshot;

  private sound: HTMLAudioElement | null = null;

  /** 上次创建音频用的地址，用来判断 soundUrl 换了没有。 */
  private soundUrl: string | undefined = undefined;

  private readonly unsubscribeQueue: () => void;

  constructor(options: NotificationStoreOptions = {}) {
    this.options = options;
    this.config = { ...DEFAULT_NOTIFICATION_CONFIG, ...options.defaultConfig };

    this.queue = new PriorityQueue<QueuedNotification>({
      capacity: this.config.maxNotifications,
      compare: compareNotifications,
      getId: item => item.id
    });

    this.snapshot = this.buildSnapshot();
    this.unsubscribeQueue = this.queue.subscribe(this.refresh);
  }

  // ==================== 订阅 ====================

  /**
   * 读当前快照。
   *
   * 写成箭头属性是因为 useSyncExternalStore 要求函数身份稳定，写成普通方法每次渲染取到的 都是同一个引用，但 this 会丢。
   */
  getSnapshot = (): NotificationSnapshot => this.snapshot;

  /** 订阅快照变化，配合 getSnapshot 交给 useSyncExternalStore。 */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  /** 断开与队列的联系并清空订阅方。实例不再复用时调。 */
  destroy = (): void => {
    this.unsubscribeQueue();
    this.queue.clear();
    this.listeners.clear();
  };

  // ==================== 写入 ====================

  /**
   * 添加一条通知，返回它的 id。
   *
   * 没带 id 的会生成一个随机 id —— 那等于声明这条不参与去重，重复投递会重复展示。 要去重就把稳定 id 带进来（推送场景用服务端信封里的 msg_id）。
   */
  add = (input: AddNotificationInput): string => {
    this.seq += 1;

    const item: QueuedNotification = {
      ...input,
      id: input.id ?? nanoid(),
      read: input.read ?? false,
      seq: this.seq,
      timestamp: input.timestamp ?? Date.now()
    };

    // 同 id 已经在队列里说明是重复投递（WebSocket 和 SSE 同时连着会把同一条推两遍），
    // 静默丢掉：再播一次音、再弹一次浏览器通知就穿帮了
    if (!this.queue.enqueue(item)) {
      return item.id;
    }

    if (!item.silent) {
      this.playSound();
    }

    if (item.showBrowserNotification !== false) {
      this.showBrowserNotification(item);
    }

    return item.id;
  };

  addInfo = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'info' });

  addSuccess = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'success' });

  addWarning = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'warning' });

  addError = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'error' });

  addMessage = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'message' });

  /** 将指定通知标记为已读。 */
  markAsRead = (id: string): void => {
    this.queue.update(id, prev => (prev.read ? prev : { ...prev, read: true }));
  };

  /** 将所有通知标记为已读。 */
  markAllAsRead = (): void => {
    this.queue.updateBy(
      item => !item.read,
      item => ({ ...item, read: true })
    );
  };

  /** 移除指定通知。 */
  remove = (id: string): void => {
    this.queue.remove(id);
  };

  /** 清空全部通知。 */
  clearAll = (): void => {
    this.queue.clear();
  };

  /** 仅清除已读通知，保留未读通知。 */
  clearRead = (): void => {
    this.queue.removeBy(item => item.read);
  };

  // ==================== 配置与权限 ====================

  /** 更新运行时配置，未传入的字段保持不变。 */
  updateConfig = (updates: Partial<NotificationConfig>): void => {
    this.config = { ...this.config, ...updates };
    this.queue.setCapacity(this.config.maxNotifications);
    this.refresh();
  };

  /**
   * 替换宿主注入的选项。
   *
   * Provider 每次渲染拿到的回调都是新函数，这里整体换掉即可；只有用户操作才会触发这些回调， 那时最近一次渲染的选项早已同步进来。
   */
  setOptions = (options: NotificationStoreOptions): void => {
    this.options = options;
  };

  /**
   * 从浏览器读一次授权状态。
   *
   * 不放构造函数里：服务端渲染时读不到，客户端 hydrate 时读得到，两边对不上会报 mismatch。 交给 React 在 effect 里调。
   */
  syncPermission = (): void => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    this.setPermission(window.Notification.permission);
  };

  /** 请求浏览器通知权限，并同步权限状态。 */
  requestPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      this.options.onBrowserNotificationUnsupported?.();
      return false;
    }

    try {
      const permission = await window.Notification.requestPermission();
      this.setPermission(permission);

      return permission === 'granted';
    } catch (error) {
      this.options.onRequestPermissionError?.(error);
      return false;
    }
  };

  // ==================== 内部 ====================

  private buildSnapshot(): NotificationSnapshot {
    const notifications = [...this.queue.toArray()];

    return {
      config: this.config,
      notifications,
      permission: this.permission,
      unreadCount: notifications.reduce((count, item) => (item.read ? count : count + 1), 0)
    };
  }

  /** 判断当前时间是否处于免打扰时段。 */
  private isDoNotDisturbTime(): boolean {
    if (!this.config.doNotDisturb || !this.config.doNotDisturbTime) {
      return false;
    }

    const { end, start } = this.config.doNotDisturbTime;

    return isWithinTimeRange(getCurrentTimeText(), start, end);
  }

  /** 获取并缓存通知音频实例，音频地址变化时重新创建。 */
  private getSound(): HTMLAudioElement | null {
    const { soundUrl } = this.options;

    if (!soundUrl || typeof Audio === 'undefined') {
      return null;
    }

    if (!this.sound || this.soundUrl !== soundUrl) {
      this.sound = new Audio(soundUrl);
      this.soundUrl = soundUrl;
    }

    return this.sound;
  }

  /** 播放通知音效，并将播放失败交给宿主应用处理。 */
  private playSound(): void {
    if (!this.config.soundEnabled || this.isDoNotDisturbTime()) {
      return;
    }

    const sound = this.getSound();

    if (!sound) {
      return;
    }

    try {
      sound.currentTime = 0;
      sound.play().catch(error => {
        this.options.onPlaySoundError?.(error);
      });
    } catch (error) {
      this.options.onPlaySoundError?.(error);
    }
  }

  /** 重建快照并通知所有订阅方。队列变化会自动走到这里，改配置和权限要手动调。 */
  private refresh = (): void => {
    this.snapshot = this.buildSnapshot();

    for (const listener of this.listeners) {
      listener();
    }
  };

  private setPermission(permission: NotificationPermission): void {
    if (this.permission === permission) return;

    this.permission = permission;
    this.refresh();
  }

  /** 根据当前配置显示浏览器原生通知。 */
  private showBrowserNotification(notification: NotificationItem): void {
    if (!this.config.browserNotificationEnabled || this.isDoNotDisturbTime()) {
      return;
    }

    if (this.permission !== 'granted') {
      return;
    }

    if (notification.silent || notification.showBrowserNotification === false) {
      return;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    try {
      const browserNotification = new window.Notification(notification.title, {
        body: notification.content,
        icon: notification.icon
      });

      browserNotification.addEventListener('click', () => {
        window.focus();

        if (notification.link) {
          if (this.options.onNavigate) {
            this.options.onNavigate(notification.link, notification);
          } else {
            window.location.href = notification.link;
          }
        }

        browserNotification.close();
      });
    } catch (error) {
      this.options.onBrowserNotificationError?.(error);
    }
  }
}
