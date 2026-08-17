import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactNode, Ref } from 'react';
import type { SlotClassNames } from '../../types';
import type { SheetSlots } from '../sheet/types';

/** ActionSheet 单个操作项 */
export interface ActionSheetAction {
  /** 点击后的回调函数，与 onSelect 同时触发，用于把行为写在数据里 */
  callback?: () => void;

  /** 操作项根节点的自定义类名；RN 的文字颜色不从父节点继承，想改字色请用 color 或 classNames.actionName */
  className?: string;

  /** 文字颜色，直接写进 style，优先级高于选中态的主题色 */
  color?: string;

  /** 是否禁用 */
  disabled?: boolean;

  /** 操作项图标，仅 variant="button" 时渲染 */
  icon?: ReactNode;

  /** 是否显示加载状态，加载中时文字被指示器替换且不可点击 */
  loading?: boolean;

  /** 操作项名称，支持 ReactNode 自定义渲染 */
  name: ReactNode;

  /** 操作项描述信息，支持 ReactNode 自定义渲染 */
  subname?: ReactNode;

  /** 操作项的值，用于 value / onChange 匹配，同时作为列表 key（必传，因为 name 可能是 ReactNode） */
  value: string;
}

/** ActionSheet 组件可覆盖的 slot 名称 */
export type ActionSheetSlots =
  | 'action'
  | 'actionName'
  | 'actionSubname'
  | 'cancel'
  | 'cancelGap'
  | 'cancelName'
  | 'indicator'
  | 'root';

/** ActionSheet 展示变体 */
export type ActionSheetVariant = 'button' | 'default';

/** Render prop children 接收的参数 */
export interface ActionSheetRenderArgs {
  /** 当前选中的操作项，未选中时为 undefined；展示文本直接取 action.name，无需另外维护一份纯文本 */
  action?: ActionSheetAction;

  /** 切换面板显示 / 隐藏 */
  toggle: () => void;

  /** 当前选中值 */
  value: string;
}

/** ActionSheet 操作面板组件属性 */
export interface ActionSheetProps {
  /** 操作项列表 */
  actions?: ActionSheetAction[];

  /** 取消按钮文字，不设置则不显示取消按钮 */
  cancelText?: string;

  /** Render prop children，接收 { action, value, toggle } 用于展示当前选中项并控制面板 */
  children?: (args: ActionSheetRenderArgs) => ReactNode;

  /** 内容容器的自定义类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<ActionSheetSlots>;

  /** 是否显示关闭按钮 */
  closeable?: boolean;

  /** 是否允许点击遮罩关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /** 点击选项后是否自动关闭 */
  closeOnClickAction?: boolean;

  /** 非受控模式默认是否显示 */
  defaultShow?: boolean;

  /** 非受控模式默认选中值 */
  defaultValue?: string;

  /** 描述信息，显示在标题下方 */
  description?: string;

  /** 是否允许下拉关闭，默认 true */
  enablePanDownToClose?: boolean;

  /** 取消按钮点击回调 */
  onCancel?: () => void;

  /** 选中值变化回调 */
  onChange?: (value: string) => void;

  /**
   * 退场动画播放完毕、面板真正卸载后触发。
   *
   * 与 onUpdateShow(false) 的区别：后者是「请求关闭」，此时动画才刚开始； 命令式调用要等这个回调才能安全移除 Portal 节点，否则面板会硬闪消失。
   */
  onClosed?: () => void;

  /** 选项点击回调 */
  onSelect?: (action: ActionSheetAction, index: number) => void;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /**
   * 底层 BottomSheetModal 的实例引用，原样透传给内部 Sheet。
   *
   * ActionSheet 把 Sheet 整个包住了，不透出来调用方就再也够不到 snapToIndex / expand / collapse 这类 show 表达不了的命令式操作。
   */
  ref?: Ref<BottomSheetModal>;

  /** 覆盖内部 Sheet 面板本体的样式类名 */
  sheetClassName?: string;

  /** 覆盖内部 Sheet 各 slot 的类名 */
  sheetClassNames?: SlotClassNames<SheetSlots>;

  /** 是否显示面板（受控） */
  show?: boolean;

  /** 是否显示顶部拖拽指示条 */
  showHandle?: boolean;

  /** 面板标题 */
  title?: string;

  /** 受控选中值 */
  value?: string;

  /** 展示变体：default 为文字列表，button 为按钮卡片 */
  variant?: ActionSheetVariant;
}

/** ActionSheet 选项选择结果 */
export interface ActionSheetResult {
  /** 选中的操作项 */
  action: ActionSheetAction;

  /** 选中项的索引 */
  index: number;
}

/**
 * ShowActionSheet 函数调用选项
 *
 * 展示状态由内部的 Renderer 托管，所以 show / defaultShow / onUpdateShow / onClosed 不再开放； value 同理——命令式调用没有外部状态可以受控，预选值请传
 * defaultValue。
 */
export interface ActionSheetOptions extends Omit<
  ActionSheetProps,
  'children' | 'defaultShow' | 'onClosed' | 'onUpdateShow' | 'show' | 'value'
> {
  /** 选中或取消后的通用回调，与 Promise 一同结算，且恰好触发一次 */
  callback?: (result: ActionSheetResult | null) => void;
}
