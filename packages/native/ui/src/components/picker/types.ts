import type { ReactNode, Ref } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { SlotClassNames } from '../../types';
import type { SheetSlots } from '../sheet/types';

/** Picker 可覆盖的 slot 名称 */
export type PickerSlots =
  | 'cancel'
  | 'cancelText'
  | 'column'
  | 'columns'
  | 'confirm'
  | 'confirmText'
  | 'item'
  | 'itemText'
  | 'loading'
  | 'root'
  | 'selectedIndicator'
  | 'title'
  | 'toolbar';

/** 单个选项 */
export interface PickerOption {
  /** 级联模式下的子选项 */
  children?: PickerOption[];

  /** 是否禁用该选项 */
  disabled?: boolean;

  /**
   * 显示文本。
   *
   * 声明成可选而非必填：配了 `fieldNames.label` 的数据源本来就没有这个字段， 必填会让自定义字段名在 TS 下彻底不可用。
   */
  label?: string;

  /** 选项值，同样可以由 `fieldNames.value` 改名 */
  value?: string;

  /** 允许通过 fieldNames 映射到任意字段名 */
  [key: string]: unknown;
}

/** 选项对象的字段名映射 */
export interface PickerFieldNames {
  /** 子选项字段名，默认 'children' */
  children?: string;

  /** 显示文本字段名，默认 'label' */
  label?: string;

  /** 选项值字段名，默认 'value' */
  value?: string;
}

/** 列数据形态 */
export type PickerColumnType = 'cascade' | 'multiple' | 'single';

/** PickerColumn 的内部属性，不对外导出 */
export interface PickerColumnProps {
  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<PickerSlots>;

  /** 该列在 Picker 中的下标 */
  columnIndex: number;

  /** 字段名映射 */
  fieldNames: Required<PickerFieldNames>;

  /** 滚过一格时是否触发轻触反馈 */
  haptic?: boolean;

  /** 每个选项的高度（px） */
  itemHeight: number;

  /** 选中值变化回调 */
  onChange: (value: string, columnIndex: number) => void;

  /** 该列的选项 */
  options: PickerOption[];

  /** 当前选中值 */
  value: string;

  /** 可见选项数 */
  visibleCount: number;
}

/** PickerToolbar 的内部属性，不对外导出 */
export interface PickerToolbarProps {
  /** 取消按钮文字 */
  cancelText: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<PickerSlots>;

  /** 确定按钮文字 */
  confirmText: string;

  /** 点击取消的回调 */
  onCancel: () => void;

  /** 点击确定的回调 */
  onConfirm: () => void;

  /** 标题 */
  title?: string;
}

/** 内联选择器属性 */
export interface PickerViewProps {
  /** 取消按钮文字 */
  cancelText?: string;

  /** 根节点类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<PickerSlots>;

  /** 列数据：单列（PickerOption[]）、多列（PickerOption[][]）或级联（带 children 的 PickerOption[]） */
  columns: PickerOption[] | PickerOption[][];

  /** 确定按钮文字 */
  confirmText?: string;

  /** 默认选中值（非受控） */
  defaultValue?: string[];

  /** 自定义字段名映射 */
  fieldNames?: PickerFieldNames;

  /** 滚过一格时是否触发轻触反馈 */
  haptic?: boolean;

  /** 每个选项的高度（px） */
  itemHeight?: number;

  /** 是否显示加载遮罩 */
  loading?: boolean;

  /** 点击取消的回调，回传当前选中值 */
  onCancel?: (values: string[]) => void;

  /** 任意一列选中值变化的回调 */
  onChange?: (values: string[]) => void;

  /** 点击确定的回调，回传当前选中值 */
  onConfirm?: (values: string[]) => void;

  /** 是否显示顶部工具栏 */
  showToolbar?: boolean;

  /** 工具栏标题 */
  title?: string;

  /** 选中值（受控） */
  value?: string[];

  /** 每列可见的选项数，取奇数——偶数时选中指示线落不到正中 */
  visibleCount?: number;
}

/** 弹层选择器属性 */
export interface PickerProps extends PickerViewProps {
  /** 触发元素，可以是节点或渲染函数 */
  children?: ReactNode | ((params: { open: () => void; value: string[] }) => ReactNode);

  /** 点击遮罩是否关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /**
   * 是否允许下拉关闭，默认 false。
   *
   * 滚轮要独占垂直手势，所以 Picker 关掉了面板的内容拖拽（enableContentPanningGesture）， 下拉通道只剩顶部 handle，而 Picker 默认不显示 handle。
   * 要用这个能力得同时传 `showHandle`，否则开了也无处可拖。
   */
  enablePanDownToClose?: boolean;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /**
   * 底层 BottomSheetModal 的实例引用，原样透传给内部 Sheet。
   *
   * Picker 把 Sheet 整个包住了，不透出来调用方就再也够不到 snapToIndex / expand / collapse 这类 show 表达不了的命令式操作。
   */
  ref?: Ref<BottomSheetModal>;

  /** 覆盖内部 Sheet 面板本体的样式类名；`className` 给的是滚轮那块，不是面板 */
  sheetClassName?: string;

  /** 覆盖内部 Sheet 各 slot 的类名 */
  sheetClassNames?: SlotClassNames<SheetSlots>;

  /** 是否显示弹层 */
  show: boolean;

  /** 是否显示面板顶部的拖拽指示条，默认 false */
  showHandle?: boolean;
}
