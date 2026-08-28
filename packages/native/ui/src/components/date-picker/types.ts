import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactNode, Ref } from 'react';
import type { SlotClassNames } from '../../types';
import type { PickerOption, PickerViewProps } from '../picker/types';
import type { SheetSlots } from '../sheet/types';

/** 日期列的类型标识 */
export type DatePickerColumnType = 'day' | 'month' | 'year';

/** 过滤器，用来从某一列里剔除选项（如跳过周末、只保留每月 1 号和 15 号） */
export type DatePickerFilter = (
  columnType: DatePickerColumnType,
  options: PickerOption[],
  values: string[]
) => PickerOption[];

/** 格式化器，用来定制选项的显示文本（如给数字加上「年」「月」「日」） */
export type DatePickerFormatter = (type: DatePickerColumnType, option: PickerOption) => PickerOption;

/**
 * 内联日期选择器属性。
 *
 * 列由 columnsType 与 min / maxDate 推导，所以 columns 与 fieldNames 不再对外开放。
 */
export interface DatePickerViewProps extends Omit<PickerViewProps, 'columns' | 'fieldNames'> {
  /** 显示哪几列及其顺序，默认 ['year', 'month', 'day'] */
  columnsType?: DatePickerColumnType[];

  /** 剔除部分选项 */
  filter?: DatePickerFilter;

  /** 定制选项的显示文本 */
  formatter?: DatePickerFormatter;

  /** 可选的最大日期，默认今天往后 10 年 */
  maxDate?: Date;

  /** 可选的最小日期，默认今天往前 10 年 */
  minDate?: Date;
}

/** 弹层日期选择器属性 */
export interface DatePickerProps extends DatePickerViewProps {
  /** 触发元素，可以是节点或渲染函数 */
  children?: ReactNode | ((params: { open: () => void; value: string[] }) => ReactNode);

  /** 点击遮罩是否关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /**
   * 是否允许下拉关闭，默认 false。
   *
   * 与 Picker 同理：滚轮独占垂直手势，面板的内容拖拽是关掉的，下拉通道只剩顶部 handle， 要用这个能力得同时传 `showHandle`。
   */
  enablePanDownToClose?: boolean;

  /**
   * 已确认值变化的回调。
   *
   * 语义与内联的 DatePickerView 不同：面板里滚动只改临时值，只有点「确定」才会走到这里。
   */
  onChange?: (values: string[]) => void;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 底层 BottomSheetModal 的实例引用，原样透传给内部 Sheet，用于 snapToIndex / expand 这类命令式操作 */
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
