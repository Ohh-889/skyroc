import type { ReactNode } from 'react';
import type { SheetSlots } from '../sheet/types';
import type { SlotClassNames } from '../../types';

/** ActionSheet 单个操作项 */
export interface ActionSheetAction {
  /** 点击后的回调函数 */
  callback?: () => void;

  /** 自定义样式类名 */
  className?: string;

  /** 文字颜色 */
  color?: string;

  /** 是否禁用 */
  disabled?: boolean;

  /** 操作项图标，仅 variant="button" 时渲染 */
  icon?: ReactNode;

  /** 纯文本标签，用于 children render prop 的 extra 展示。name 为 ReactNode 时必传 */
  label?: string;

  /** 是否显示加载状态 */
  loading?: boolean;

  /** 操作项名称，支持 ReactNode 自定义渲染 */
  name: ReactNode;

  /** 操作项描述信息，支持 ReactNode 自定义渲染 */
  subname?: ReactNode;

  /** 操作项的值，用于 value/onChange 匹配（必传，因为 name 可能是 ReactNode） */
  value: string;
}

/** ActionSheet 组件可覆盖的 slot 名称 */
export type ActionSheetSlots = 'action' | 'actionName' | 'actionSubname' | 'cancel' | 'cancelGap' | 'root';

/** ActionSheet 展示变体 */
export type ActionSheetVariant = 'button' | 'default';

/** render prop children 接收的参数 */
export interface ActionSheetRenderArgs {
  /** 选中项的显示文本（action.name），未选中时为空字符串 */
  extra: string;
  /** 切换面板显示/隐藏 */
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

  /** render prop children，接收 { value, extra, toggle } 用于展示和控制面板 */
  children?: (args: ActionSheetRenderArgs) => ReactNode;

  /** 自定义容器样式类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<ActionSheetSlots>;

  /** 是否显示关闭按钮 */
  closeable?: boolean;

  /** 点击选项后是否自动关闭 */
  closeOnClickAction?: boolean;

  /** 覆盖内部 Sheet 的样式类名 */
  sheetClassName?: string;

  /** 覆盖内部 Sheet 各 slot 的类名 */
  sheetClassNames?: SlotClassNames<SheetSlots>;

  /** 非受控模式默认是否显示 */
  defaultShow?: boolean;

  /** 非受控模式默认选中值 */
  defaultValue?: string;

  /** 描述信息，显示在标题下方 */
  description?: string;

  /** 取消按钮点击回调 */
  onCancel?: () => void;

  /** 选中值变化回调 */
  onChange?: (value: string) => void;

  /** 选项点击回调 */
  onSelect?: (action: ActionSheetAction, index: number) => void;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 是否显示面板（受控） */
  show?: boolean;

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

/** showActionSheet 函数调用选项 */
export interface ActionSheetOptions extends Omit<
  ActionSheetProps,
  'children' | 'defaultShow' | 'onUpdateShow' | 'show'
> {
  /** 选项选中或取消后的通用回调 */
  callback?: (result: ActionSheetResult | null) => void;
}
