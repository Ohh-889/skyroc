import type { NotificationStore } from './notification-store';

/** 通知的视觉分类。 */
export type NotificationType = 'error' | 'info' | 'message' | 'success' | 'warning';

/** 通知在面板中展示的优先级。 */
export type NotificationPriority = 'high' | 'low' | 'normal' | 'urgent';

/** 由通知 Provider 管理的通知项。 */
export interface NotificationItem {
  /** 在通知面板中展示的主要内容。 */
  content: string;
  /** 浏览器原生通知使用的图标地址。 */
  icon?: string;
  /** 通知的稳定唯一标识。 */
  id: string;
  /** 点击浏览器通知后跳转的目标地址。 */
  link?: string;
  /** 由调用方自定义的扩展元数据。 */
  meta?: Record<string, unknown>;
  /** 在面板标签中展示的优先级提示。 */
  priority?: NotificationPriority;
  /** 当前通知是否已读。 */
  read: boolean;
  /** 是否同时创建浏览器原生通知。 */
  showBrowserNotification?: boolean;
  /** 是否跳过通知音效。 */
  silent?: boolean;
  /** 通知创建时间，使用毫秒时间戳。 */
  timestamp: number;
  /** 通知标题。 */
  title: string;
  /** 用于确定图标和颜色的视觉分类。 */
  type: NotificationType;
}

/** 通知运行时配置。 */
export interface NotificationConfig {
  /** 是否启用浏览器原生通知。 */
  browserNotificationEnabled: boolean;
  /** 是否启用免打扰模式。 */
  doNotDisturb: boolean;
  /** 免打扰模式使用的本地时间范围。 */
  doNotDisturbTime?: {
    /** 结束时间，格式为 HH:mm。 */
    end: string;
    /** 开始时间，格式为 HH:mm。 */
    start: string;
  };
  /** 最多保留的通知数量。 */
  maxNotifications: number;
  /** 是否启用通知音效。 */
  soundEnabled: boolean;
}

/** 创建新通知时使用的输入类型。 */
export type AddNotificationInput = Omit<NotificationItem, 'id' | 'read' | 'timestamp'> &
  Partial<Pick<NotificationItem, 'id' | 'read' | 'timestamp'>>;

/** 各类快捷通知创建函数共用的可选参数。 */
export type NotificationShortcutOptions = Partial<
  Omit<NotificationItem, 'content' | 'id' | 'read' | 'timestamp' | 'title' | 'type'>
> &
  Partial<Pick<NotificationItem, 'id' | 'read' | 'timestamp'>>;

/** 通知仓库的构造选项，全是宿主应用要注入的东西：音效地址和各种失败回调。 */
export interface NotificationStoreOptions {
  /** 初始配置，会与包内默认配置合并。仅构造时生效，之后改配置走 updateConfig。 */
  defaultConfig?: Partial<NotificationConfig>;
  /** 浏览器通知无法显示时触发的回调。 */
  onBrowserNotificationError?: (error: unknown) => void;
  /** 当前浏览器不支持 Notification API 时触发的回调。 */
  onBrowserNotificationUnsupported?: () => void;
  /** 点击浏览器通知并需要打开链接时触发的回调。 */
  onNavigate?: (link: string, notification: NotificationItem) => void;
  /** 通知音效无法播放时触发的回调。 */
  onPlaySoundError?: (error: unknown) => void;
  /** 请求浏览器通知权限失败时触发的回调。 */
  onRequestPermissionError?: (error: unknown) => void;
  /** 宿主应用提供的可选通知音效地址。 */
  soundUrl?: string;
}

/** 通知状态 Hook 使用的配置项。 */
export interface UseNotificationOptions extends NotificationStoreOptions {
  /**
   * 复用外部已有的通知仓库，不传则 Hook 自己建一个。
   *
   * 需要在 React 树之外投递通知（WebSocket、SSE 这类连接回调）时传：宿主自己持有单例，推送 那一侧直接调 store.add，不用再绕 Context 拿 addNotification。
   */
  store?: NotificationStore;
}

/** UseSyncExternalStore 读到的快照，写操作时整体重建一次，读的时候直接返回缓存。 */
export interface NotificationSnapshot {
  /** 当前生效的运行时配置。 */
  config: NotificationConfig;
  /** 按优先级排好序的通知列表。 */
  notifications: NotificationItem[];
  /** 浏览器原生通知的授权状态。 */
  permission: NotificationPermission;
  /** 未读通知数量。 */
  unreadCount: number;
}
