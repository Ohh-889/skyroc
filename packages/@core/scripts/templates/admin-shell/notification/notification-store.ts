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

/** 把优先级换算成排序权重。未标优先级的按 normal 算，让 compareNotifications 不用到处判空。 */
function getWeight(priority: NotificationPriority | undefined): number {
  return PRIORITY_WEIGHT[priority ?? 'normal'];
}

/** 先按优先级，再按时间倒序（新的在前），最后按入队序号倒序。已读与否不参与排序：否则点一下已读整个列表会跳动。 */
function compareNotifications(a: QueuedNotification, b: QueuedNotification): number {
  return getWeight(a.priority) - getWeight(b.priority) || b.timestamp - a.timestamp || b.seq - a.seq;
}

/**
 * 取当前本地时间的 HH:mm 文本。
 *
 * 免打扰配置里的 start / end 就是这个格式，统一成字符串后可以直接比大小，不用先解析成分钟数。
 */
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

  /** 宿主注入的音效地址和各类失败回调。随 Provider 每次渲染整体替换，见 setOptions。 */
  private options: NotificationStoreOptions;

  /** 浏览器原生通知的授权状态。构造时不读，见 syncPermission。 */
  private permission: NotificationPermission = 'default';

  /** Id 去重 + 优先级排序 + 容量上限都在这里，store 自己不再维护第二份列表。 */
  private readonly queue: PriorityQueue<QueuedNotification>;

  /** 入队序号，只增不减。 */
  private seq = 0;

  /** 快照缓存。useSyncExternalStore 按引用比较，每次现算会一直重渲染。 */
  private snapshot: NotificationSnapshot;

  /** 缓存的音频实例，全部通知共用一个。每条通知新建一个的话，连着来几条会同时响。 */
  private sound: HTMLAudioElement | null = null;

  /** 上次创建音频用的地址，用来判断 soundUrl 换了没有。 */
  private soundUrl: string | undefined = undefined;

  /** 解绑「队列变化 → 重建快照」这条链的函数。只在构造时接一次，destroy 时调它断开。 */
  private readonly unsubscribeQueue: () => void;

  /**
   * 装配队列、合并默认配置、接上队列订阅。
   *
   * 这里一个浏览器 API 都不碰：读权限推到 syncPermission，建 Audio 推到第一次播放。 服务端渲染时 new 出来是安全的。
   */
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

  // 下面五个只是把 type 填好后转给 add，行为和 add 完全一致。选哪个看这条通知要给用户什么
  // 语义，type 决定的是面板里的图标和颜色。

  /** 中性告知，用户不需要做任何处理（版本更新、任务已开始）。 */
  addInfo = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'info' });

  /** 操作成功的回执（导出完成、审批通过）。 */
  addSuccess = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'success' });

  /** 需要用户留意但没有中断流程（配额快用完、证书快到期）。 */
  addWarning = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'warning' });

  /** 出错了，通常要用户重试或介入（同步失败、任务中断）。 */
  addError = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'error' });

  /** 来自其他人的消息（站内信、@ 提醒），区别于上面四种由系统发出的状态通知。 */
  addMessage = (title: string, content: string, options: NotificationShortcutOptions = {}): string =>
    this.add({ ...options, content, title, type: 'message' });

  /** 用户点开某条通知时调。已经是已读的原样返回，避免白重建一次快照、让整棵订阅树重渲染。 */
  markAsRead = (id: string): void => {
    this.queue.update(id, prev => (prev.read ? prev : { ...prev, read: true }));
  };

  /** 面板上「全部已读」按钮调。通知本身留着，只是 unreadCount 归零。 */
  markAllAsRead = (): void => {
    this.queue.updateBy(
      item => !item.read,
      item => ({ ...item, read: true })
    );
  };

  /**
   * 删掉某条通知，用户在面板上单条删除时调。
   *
   * 删掉之后这个 id 就不再参与去重，同 id 的通知再推进来会重新展示一次。
   */
  remove = (id: string): void => {
    this.queue.remove(id);
  };

  /** 清空面板，已读未读一起删。用户点「清空」时调。 */
  clearAll = (): void => {
    this.queue.clear();
  };

  /** 只删已读、保留未读。用户想收拾面板又不想漏掉没看过的东西时用。 */
  clearRead = (): void => {
    this.queue.removeBy(item => item.read);
  };

  // ==================== 配置与权限 ====================

  /**
   * 更新运行时配置，未传入的字段保持不变。设置面板上改开关走这里。
   *
   * 队列容量跟着 maxNotifications 一起改，调小会立刻挤掉超出的那部分。
   */
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

  /**
   * 弹浏览器的授权框，返回用户最终是不是给了权限。
   *
   * 必须由用户手势触发（点按钮），页面一加载就调会被浏览器直接拒掉，而且拒过一次之后 再调也不会重新弹框。
   */
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

  /**
   * 现算一个全新的快照对象，供 getSnapshot 缓存起来返回。
   *
   * 每次都返回新引用是故意的，useSyncExternalStore 靠引用变化判断要不要重渲染。 unreadCount 也在这里算好，省得每个消费组件各遍历一遍列表。
   */
  private buildSnapshot(): NotificationSnapshot {
    const notifications = [...this.queue.toArray()];

    return {
      config: this.config,
      notifications,
      permission: this.permission,
      unreadCount: notifications.reduce((count, item) => (item.read ? count : count + 1), 0)
    };
  }

  /**
   * 当前是不是在免打扰时段里。音效和浏览器通知都要先过这一关。
   *
   * 免打扰只静音，不拦截：通知照样进队列、照样算未读数，用户回来能在面板里看到全部。
   */
  private isDoNotDisturbTime(): boolean {
    if (!this.config.doNotDisturb || !this.config.doNotDisturbTime) {
      return false;
    }

    const { end, start } = this.config.doNotDisturbTime;

    return isWithinTimeRange(getCurrentTimeText(), start, end);
  }

  /**
   * 拿到可用的音频实例，没配 soundUrl 或环境里没有 Audio 就返回 null。
   *
   * 惰性创建：构造时不碰 Audio，服务端渲染才不会炸。宿主换了 soundUrl 会重新建一个。
   */
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

  /**
   * 播一次提示音。新通知进队列时由 add 调。
   *
   * 播放前把 currentTime 归零，上一条还没播完时也能重新触发。 用户还没和页面交互过时浏览器会拒绝 play，所以失败是常态而不是异常，交给宿主决定要不要提示。
   */
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

  /** 写入授权状态。值没变就早退，否则每次 syncPermission 都会白刷一遍快照。 */
  private setPermission(permission: NotificationPermission): void {
    if (this.permission === permission) return;

    this.permission = permission;
    this.refresh();
  }

  /**
   * 弹一条浏览器原生通知（页面切到后台也能看到）。新通知进队列时由 add 调。
   *
   * 开头四道闸门任意一道不过就安静跳过，面板里那条通知不受影响。 点击后聚焦回本页；带 link 的优先交给宿主的 onNavigate 走前端路由，没注入才硬跳。
   */
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
