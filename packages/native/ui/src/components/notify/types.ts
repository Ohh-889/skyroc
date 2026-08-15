/** Notify 类型 */
type NotifyType = 'danger' | 'primary' | 'success' | 'warning';

/** Notify 显示位置 */
type NotifyPosition = 'bottom' | 'top';

/** Notify 配置选项 */
interface NotifyOptions {
  /** 自动关闭延时（毫秒），0 表示不自动关闭 */
  duration?: number;

  /** 消息文本 */
  message?: string;

  /** 点击回调 */
  onClick?: () => void;

  /** 关闭时回调 */
  onClose?: () => void;

  /** 显示位置 */
  position?: NotifyPosition;

  /** Notify 类型，决定背景色 */
  type?: NotifyType;
}

/** Notify 声明式组件属性 */
interface NotifyProps extends NotifyOptions {
  /** 显示状态变更回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 控制显示/隐藏 */
  show?: boolean;
}

export type { NotifyOptions, NotifyPosition, NotifyProps, NotifyType };
