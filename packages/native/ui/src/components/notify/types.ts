import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';

/** Notify 类型 */
type NotifyType = 'danger' | 'primary' | 'success' | 'warning';

/** Notify 显示位置 */
type NotifyPosition = 'bottom' | 'top';

/** Notify 组件可覆盖的 slot 名称 */
type NotifySlots = 'content' | 'message' | 'root';

/** Notify 配置选项 */
interface NotifyOptions {
  /** 自定义背景色；仅在颜色来自主题之外（如服务端下发的品牌色）时使用，能写成类名时一律优先用 className */
  background?: string;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<NotifySlots>;

  /** 自定义文字颜色；同 background，能写成类名时一律优先用 classNames.message */
  color?: string;

  /** 自动关闭延时（毫秒），0 表示常驻不自动关闭；不传时为 3000 */
  duration?: number;

  /** 消息内容，字符串会自动包一层 Text，其余节点原样渲染 */
  message?: ReactNode;

  /** 点击 Notify 时触发；不传时 Notify 不拦截触摸，下层内容依然可点 */
  onClick?: () => void;

  /** 关闭时回调，超时关闭、命令式关闭、被新的 Notify 顶替三条路径都只触发一次 */
  onClose?: () => void;

  /** 显示位置 */
  position?: NotifyPosition;

  /** Notify 类型，决定背景色与文字颜色 */
  type?: NotifyType;
}

/** Notify 声明式组件属性 */
interface NotifyProps extends NotifyOptions {
  /** 显示状态变更回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 控制显示/隐藏 */
  show?: boolean;
}

/** Notify 命令式实例 */
interface NotifyInstance {
  /** 关闭此条 Notify；已被后来的 Notify 顶替时不做任何事 */
  close: () => void;

  /** 原地更新此条 Notify 的内容（保持同一实例，不重放动画），并按新的 duration 重新计时 */
  update: (options: NotifyOptions) => void;
}

export type { NotifyInstance, NotifyOptions, NotifyPosition, NotifyProps, NotifySlots, NotifyType };
