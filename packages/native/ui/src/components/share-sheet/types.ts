import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';

/** 分享面板选项 */
interface ShareSheetOption {
  /** 选项描述信息 */
  description?: string;

  /** 图标，传入 ReactNode（如 AntDesign、Image 等） */
  icon?: ReactNode;

  /** 选项名称 */
  name: string;
}

/** 分享面板选项列表，支持单行或多行 */
type ShareSheetOptions = ShareSheetOption[] | ShareSheetOption[][];

/** ShareSheet 组件可覆盖的 slot 名称 */
type ShareSheetSlots =
  | 'cancel'
  | 'cancelGap'
  | 'option'
  | 'optionDescription'
  | 'optionIcon'
  | 'optionName'
  | 'options'
  | 'root';

/** ShareSheet 分享面板组件属性 */
interface ShareSheetProps {
  /** 取消按钮文字，不设置则不显示 */
  cancelText?: string;

  /** 自定义容器样式类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<ShareSheetSlots>;

  /** 是否显示关闭按钮 */
  closeable?: boolean;

  /** 描述信息，显示在标题下方 */
  description?: string;

  /** 取消按钮点击回调 */
  onCancel?: () => void;

  /** 选项点击回调 */
  onSelect?: (option: ShareSheetOption, index: number) => void;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 分享选项列表 */
  options?: ShareSheetOptions;

  /** 是否显示面板 */
  show: boolean;

  /** 面板标题 */
  title?: string;
}

/** ShareSheet 选项选择结果 */
interface ShareSheetResult {
  /** 选中项的索引 */
  index: number;

  /** 选中的选项 */
  option: ShareSheetOption;
}

/** showShareSheet 函数调用选项 */
interface ShareSheetCallOptions extends Omit<ShareSheetProps, 'onUpdateShow' | 'show'> {
  /** 选项选中或取消后的通用回调 */
  callback?: (result: ShareSheetResult | null) => void;
}

export type {
  ShareSheetCallOptions,
  ShareSheetOption,
  ShareSheetOptions,
  ShareSheetProps,
  ShareSheetResult,
  ShareSheetSlots
};
