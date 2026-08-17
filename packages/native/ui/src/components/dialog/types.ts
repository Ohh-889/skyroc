import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';
import type { InputProps } from '../input/types';

/** Dialog 操作类型 */
export type DialogAction = 'cancel' | 'confirm';

/** Dialog 可覆盖的 slot 名称，popup 为外层弹出容器（宽度、定位），root 为卡片本身 */
export type DialogSlots =
  | 'body'
  | 'cancelButton'
  | 'confirmButton'
  | 'footer'
  | 'header'
  | 'message'
  | 'popup'
  | 'root'
  | 'title';

/** Dialog 底部操作区可覆盖的 slot 名称 */
export type DialogFooterSlots = 'cancelButton' | 'confirmButton' | 'footer';

/** Dialog 主题 */
export type DialogTheme = 'default' | 'round-button';

/** Round-button 主题下按钮的排列方向 */
export type DialogThemeDirection = 'horizontal' | 'vertical';

/** 确认按钮的颜色语义 */
export type DialogConfirmColor = 'destructive' | 'primary';

/** 关闭拦截器，返回 false 或 reject 则阻止关闭 */
export type DialogBeforeClose = (action: DialogAction, inputValue?: string) => boolean | Promise<boolean>;

/** Dialog 两个按钮的 loading 状态 */
export interface DialogLoading {
  /** 取消按钮是否处于 loading */
  cancel: boolean;
  /** 确认按钮是否处于 loading */
  confirm: boolean;
}

/** Dialog 对话框属性 */
export interface DialogProps {
  /**
   * 键盘弹出时是否自动避让，默认跟随 showInput
   *
   * 带输入框的对话框必须避让，输入框被键盘盖住就没法用了；纯提示类对话框位于屏幕中部，键盘只占底部，不必多包一层。 开启后 react-native-modal 会把内容包进 KeyboardAvoidingView，那一层的
   * alignItems 会让容器在交叉轴上收成内容宽度， 内部的百分比宽度随之失效——Popup 已用 `width: '100%'` 兜住，这里不受影响。
   */
  avoidKeyboard?: boolean;
  /** 关闭前的拦截回调，支持异步，pending 时按钮显示 loading。showInput 时第二个参数为输入值 */
  beforeClose?: DialogBeforeClose;
  /** 取消按钮文本，默认 '取消' */
  cancelButtonText?: string;
  /** 自定义内容区域 */
  children?: ReactNode;
  /** 覆盖卡片根节点的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;
  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<DialogSlots>;
  /** 点击遮罩是否关闭，默认 false。关闭时与点击取消同一条路径，会经过 beforeClose 并触发 onCancel */
  closeOnBackdropPress?: boolean;
  /** Android 硬件返回键是否关闭，默认 true。与遮罩点击同样按取消处理 */
  closeOnBackPress?: boolean;
  /** 确认按钮颜色语义，默认 'primary'。设为 'destructive' 时按钮显示为红色，用于删除/注销等破坏性操作 */
  confirmButtonColor?: DialogConfirmColor;
  /** 是否禁用确认按钮，默认 false */
  confirmButtonDisabled?: boolean;
  /** 确认按钮文本，默认 '确定' */
  confirmButtonText?: string;
  /** 输入框默认值（非受控），showInput 为 true 时生效 */
  defaultInputValue?: string;
  /** 输入框占位文本，showInput 为 true 时生效 */
  inputPlaceholder?: string;
  /** 透传给 Input 的额外属性。value / onChangeText 由 Dialog 接管，监听输入请用 onInputChange */
  inputProps?: Partial<InputProps>;
  /** 输入框受控值，showInput 为 true 时生效 */
  inputValue?: string;
  /** 消息文本 */
  message?: string;
  /** 消息对齐方式，默认 'center' */
  messageAlign?: 'center' | 'left' | 'right';
  /** 取消按钮回调，showInput 时参数为输入值 */
  onCancel?: (inputValue?: string) => void;
  /** 关闭动画播放完毕后的回调 */
  onClosed?: () => void;
  /** 确认按钮回调，showInput 时参数为输入值 */
  onConfirm?: (inputValue?: string) => void;
  /** 输入框内容变化回调 */
  onInputChange?: (value: string) => void;
  /** 打开动画播放完毕后的回调 */
  onOpened?: () => void;
  /** 显示状态变化回调，始终在 onConfirm / onCancel 之后触发 */
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
  /** Round-button 主题下的按钮排列方向，默认 'vertical' */
  themeDirection?: DialogThemeDirection;
  /** 标题 */
  title?: string;
}

/** Dialog 底部操作区属性，所有默认值都已在 Dialog 中落地，这里一律必填 */
export interface DialogFooterProps {
  /** 取消按钮文本 */
  cancelButtonText: string;
  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<DialogFooterSlots>;
  /** 确认按钮颜色语义 */
  confirmButtonColor: DialogConfirmColor;
  /** 是否禁用确认按钮 */
  confirmButtonDisabled: boolean;
  /** 确认按钮文本 */
  confirmButtonText: string;
  /** 两个按钮的 loading 状态 */
  loading: DialogLoading;
  /** 点击取消 */
  onCancel: () => void;
  /** 点击确认 */
  onConfirm: () => void;
  /** 是否显示取消按钮 */
  showCancelButton: boolean;
  /** 是否显示确认按钮 */
  showConfirmButton: boolean;
  /** 按钮主题 */
  theme: DialogTheme;
  /** Round-button 主题下的按钮排列方向 */
  themeDirection: DialogThemeDirection;
}

/** 命令式调用 Dialog 的配置项 */
export interface DialogOptions extends Omit<DialogProps, 'onClosed' | 'onUpdateShow' | 'show'> {
  /** 操作回调，confirm 或 cancel，showInput 时第二个参数为输入值 */
  callback?: (action: DialogAction, inputValue?: string) => void;
}
