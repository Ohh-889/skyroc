import type { ReactNode } from 'react';

/** Toast 类型 */
export type ToastType = 'fail' | 'loading' | 'success' | 'text';

/** Toast 位置 */
export type ToastPosition = 'bottom' | 'middle' | 'top';

/** Toast 配置选项 */
export interface ToastOptions {
  /** 是否允许点击 Toast 关闭 */
  closeOnClick?: boolean;

  /** 自动关闭延时（毫秒），0 表示常驻不自动关闭；不传时 loading 为 0、其余类型为 2000 */
  duration?: number;

  /** 是否禁止背景点击（在 Toast 下方铺一层透明遮罩拦截触摸） */
  forbidClick?: boolean;

  /** 自定义图标内容，覆盖内置图标 */
  icon?: ReactNode;

  /** Toast 消息内容，字符串会自动包一层 Text，其余节点原样渲染 */
  message?: ReactNode;

  /** 关闭时回调，超时关闭、点击关闭、命令式关闭三条路径都只触发一次 */
  onClose?: () => void;

  /** Toast 垂直位置 */
  position?: ToastPosition;

  /** Toast 类型 */
  type?: ToastType;
}

/** Toast 声明式组件属性 */
export interface ToastProps extends ToastOptions {
  /** 显示状态变更回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 控制显示/隐藏 */
  show?: boolean;
}

/** Toast 命令式实例 */
export interface ToastInstance {
  /** 关闭当前 Toast */
  close: () => void;

  /** 原地更新当前 Toast 的内容（保持同一实例，不重新创建） */
  update: (options: ToastOptions) => void;
}
