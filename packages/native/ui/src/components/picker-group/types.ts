import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactNode, Ref } from 'react';
import type { SlotClassNames } from '../../types';
import type { PickerFieldNames, PickerOption, PickerSlots } from '../picker/types';
import type { SheetSlots } from '../sheet/types';

/** 组内单个选择器的配置 */
export interface PickerGroupItem {
  /** 覆盖该 PickerView 各 slot 的类名 */
  classNames?: SlotClassNames<PickerSlots>;

  /** 列数据：单列（PickerOption[]）、多列（PickerOption[][]）或级联（带 children 的 PickerOption[]） */
  columns: PickerOption[] | PickerOption[][];

  /** 该选择器的默认选中值 */
  defaultValue?: string[];

  /** 自定义字段名映射 */
  fieldNames?: PickerFieldNames;

  /** 滚过一格时是否触发轻触反馈 */
  haptic?: boolean;

  /** 每个选项的高度（px） */
  itemHeight?: number;

  /** 该 tab 的唯一标识，缺省时退回下标 */
  key?: string;

  /** 是否显示加载遮罩 */
  loading?: boolean;

  /** Tab 标签文字 */
  title: string;

  /** 每列可见的选项数 */
  visibleCount?: number;
}

/** PickerGroup 可覆盖的 slot 名称 */
export type PickerGroupSlots =
  | 'activeIndicator'
  | 'cancel'
  | 'cancelText'
  | 'confirm'
  | 'confirmText'
  | 'root'
  | 'tab'
  | 'tabBar'
  | 'tabText'
  | 'toolbar';

/** 内联分组选择器属性 */
export interface PickerGroupViewProps {
  /** 当前激活的 tab 下标（受控） */
  activeTab?: number;

  /** 取消按钮文字 */
  cancelText?: string;

  /** 根节点类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<PickerGroupSlots>;

  /** 确定按钮文字 */
  confirmText?: string;

  /** 默认激活的 tab 下标（非受控） */
  defaultActiveTab?: number;

  /** 所有选择器的默认选中值；缺省时逐个取 `pickers[i].defaultValue` */
  defaultValues?: string[][];

  /** 非末尾 tab 上确定按钮的文字 */
  nextStepText?: string;

  /** 点击取消的回调，回传当前所有选中值 */
  onCancel?: (values: string[][]) => void;

  /**
   * 任意一个选择器选中值变化的回调，滚动过程中即触发，回传变化的选择器下标。
   *
   * 注意与 `Picker` 的差异：`Picker` 的 onChange 挂在已确认值上、点「确定」才触发； 这里的 onChange 是实时的，提交时机请用 `onConfirm`。
   */
  onChange?: (values: string[][], pickerIndex: number) => void;

  /** 在最后一个 tab 点击确定的回调，回传所有选中值 */
  onConfirm?: (values: string[][]) => void;

  /** 激活 tab 变化的回调 */
  onTabChange?: (index: number) => void;

  /** 各个选择器的配置 */
  pickers: PickerGroupItem[];

  /** 是否显示 tab 栏；只有一个选择器时始终不显示 */
  showTabBar?: boolean;

  /** 是否显示顶部工具栏 */
  showToolbar?: boolean;

  /** 所有选择器的选中值（受控） */
  values?: string[][];
}

/**
 * 弹层分组选择器属性。
 *
 * `activeTab` / `defaultActiveTab` 不对外开放：面板每次打开都要回到第一个 tab， 受控的 tab 与这条规则冲突，接了也会被立刻覆盖。
 */
export interface PickerGroupProps extends Omit<PickerGroupViewProps, 'activeTab' | 'defaultActiveTab'> {
  /** 触发元素，可以是节点或渲染函数 */
  children?: ReactNode | ((params: { open: () => void; values: string[][] }) => ReactNode);

  /** 点击遮罩是否关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /**
   * 是否允许下拉关闭，默认 false。
   *
   * 滚轮要独占垂直手势，所以这里关掉了面板的内容拖拽（enableContentPanningGesture）， 下拉通道只剩顶部 handle，而 PickerGroup 默认不显示 handle。 要用这个能力得同时传
   * `showHandle`，否则开了也无处可拖。
   */
  enablePanDownToClose?: boolean;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /**
   * 底层 BottomSheetModal 的实例引用，原样透传给内部 Sheet。
   *
   * PickerGroup 把 Sheet 整个包住了，不透出来调用方就再也够不到 snapToIndex / expand / collapse 这类 show 表达不了的命令式操作。
   */
  ref?: Ref<BottomSheetModal>;

  /** 覆盖内部 Sheet 面板本体的样式类名；`className` 给的是选择器那块，不是面板 */
  sheetClassName?: string;

  /** 覆盖内部 Sheet 各 slot 的类名 */
  sheetClassNames?: SlotClassNames<SheetSlots>;

  /** 是否显示弹层 */
  show: boolean;

  /** 是否显示面板顶部的拖拽指示条，默认 false */
  showHandle?: boolean;
}
