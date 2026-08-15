import type { ReactNode } from 'react';
import type { InputProps } from '../input/types';

/** Dialog 操作类型 */
export type DialogAction = 'cancel' | 'confirm';

/** Dialog 主题 */
export type DialogTheme = 'default' | 'round-button';

/** 关闭拦截器，返回 false 或 reject 则阻止关闭 */
export type DialogBeforeClose = (action: DialogAction, inputValue?: string) => boolean | Promise<boolean>;

/** Dialog 对话框属性 */
export interface DialogProps {
  /** 键盘弹出时是否自动避让，默认 false */
  avoidKeyboard?: boolean;
  /** 关闭前的拦截回调，支持异步，pending 时按钮显示 loading。showInput 时第二个参数为输入值 */
  beforeClose?: DialogBeforeClose;
  /** 取消按钮文本，默认 'Cancel' */
  cancelButtonText?: string;
  /** 自定义内容区域 */
  children?: ReactNode;
  /** 自定义样式类名 */
  className?: string;
  /** Popup 外层容器样式，默认宽度为 w-[80%] */
  popupClassName?: string;
  /** 确认按钮颜色语义，默认 'primary'。设为 'destructive' 时按钮显示为红色，用于删除/注销等破坏性操作 */
  confirmButtonColor?: 'destructive' | 'primary';
  /** 是否禁用确认按钮，默认 false */
  confirmButtonDisabled?: boolean;
  /** 确认按钮文本，默认 'Confirm' */
  confirmButtonText?: string;
  /** 输入框默认值（非受控），showInput 为 true 时生效 */
  defaultInputValue?: string;
  /** 输入框占位文本，showInput 为 true 时生效 */
  inputPlaceholder?: string;
  /** 透传给 Input 组件的额外属性 */
  inputProps?: Partial<InputProps>;
  /** 输入框受控值，showInput 为 true 时生效 */
  inputValue?: string;
  /** 消息文本 */
  message?: string;
  /** 消息对齐方式，默认 'center' */
  messageAlign?: 'center' | 'left' | 'right';
  /** 取消按钮回调，showInput 时参数为输入值 */
  onCancel?: (inputValue?: string) => void;
  /** 确认按钮回调，showInput 时参数为输入值 */
  onConfirm?: (inputValue?: string) => void;
  /** 输入框内容变化回调 */
  onInputChange?: (value: string) => void;
  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;
  /** 是否显示对话框 */
  show: boolean;
  /** 是否显示取消按钮，默认 false */
  showCancelButton?: boolean;
  /** 是否显示确认按钮，默认 true */
  showConfirmButton?: boolean;
  /** 是否显示输入框，默认 false */
  showInput?: boolean;
  /** 按钮主题，默认 'default' */
  theme?: DialogTheme;
  /** round-button 主题下的按钮排列方向，默认 'vertical' */
  themeDirection?: 'horizontal' | 'vertical';
  /** 标题 */
  title?: string;
}

/** 命令式调用 Dialog 的配置项 */
export interface DialogOptions extends Omit<DialogProps, 'onUpdateShow' | 'show'> {
  /** 操作回调，confirm 或 cancel，showInput 时第二个参数为输入值 */
  callback?: (action: DialogAction, inputValue?: string) => void;
}
