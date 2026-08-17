import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ReactNode, Ref } from 'react';
import type { SlotClassNames } from '../../types/shared';
import type { SheetSlots } from '../sheet/types';

/** 分享面板选项 */
interface ShareSheetOption {
  /** 选项根节点的自定义类名；RN 的文字颜色不从父节点继承，想改字色请用 classNames.optionName */
  className?: string;

  /** 选项描述信息，支持 ReactNode 自定义渲染 */
  description?: ReactNode;

  /** 图标，传入 ReactNode（如 AntDesign、Image 等） */
  icon?: ReactNode;

  /** 选项名称，支持 ReactNode 自定义渲染 */
  name: ReactNode;

  /** 选项的值，作为列表 key 与选中标识（必传，因为 name 可能是 ReactNode） */
  value: string;
}

/** 分享面板选项列表：一维数组为单行，二维数组为多行，行与行之间用分割线隔开 */
type ShareSheetOptions = ShareSheetOption[] | ShareSheetOption[][];

/** ShareSheet 组件可覆盖的 slot 名称 */
type ShareSheetSlots =
  | 'cancel'
  | 'cancelGap'
  | 'cancelName'
  | 'option'
  | 'optionDescription'
  | 'optionIcon'
  | 'optionName'
  | 'options'
  | 'root'
  | 'row';

/** ShareSheet 分享面板组件属性 */
interface ShareSheetProps {
  /** 取消按钮文字，不设置则不显示取消按钮 */
  cancelText?: string;

  /** 内容容器的自定义类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<ShareSheetSlots>;

  /** 是否显示关闭按钮 */
  closeable?: boolean;

  /** 是否允许点击遮罩关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /** 点击选项后是否自动关闭 */
  closeOnSelect?: boolean;

  /** 非受控模式默认是否显示 */
  defaultShow?: boolean;

  /** 描述信息，显示在标题下方 */
  description?: ReactNode;

  /** 是否允许下拉关闭，默认 true */
  enablePanDownToClose?: boolean;

  /** 取消按钮点击回调 */
  onCancel?: () => void;

  /**
   * 退场动画播放完毕、面板真正卸载后触发。
   *
   * 与 onUpdateShow(false) 的区别：后者是「请求关闭」，此时动画才刚开始； 命令式调用要等这个回调才能安全移除 Portal 节点，否则面板会硬闪消失。
   */
  onClosed?: () => void;

  /**
   * 选项点击回调。
   *
   * Index 是选项在**所在行**内的下标，单独看无法定位多行布局里的某一项，所以第三个参数补上行下标； 单行写法等价于只有一行，rowIndex 恒为 0。要跨行唯一标识一项，请直接用 option.value。
   */
  onSelect?: (option: ShareSheetOption, index: number, rowIndex: number) => void;

  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;

  /** 分享选项列表 */
  options?: ShareSheetOptions;

  /**
   * 底层 BottomSheetModal 的实例引用，原样透传给内部 Sheet。
   *
   * ShareSheet 把 Sheet 整个包住了，不透出来调用方就再也够不到 snapToIndex / expand / collapse 这类 show 表达不了的命令式操作。
   */
  ref?: Ref<BottomSheetModal>;

  /** 覆盖内部 Sheet 面板本体（背景 + 圆角）的样式类名 */
  sheetClassName?: string;

  /** 覆盖内部 Sheet 各 slot 的类名 */
  sheetClassNames?: SlotClassNames<SheetSlots>;

  /** 是否显示面板（受控） */
  show?: boolean;

  /** 是否显示顶部拖拽指示条 */
  showHandle?: boolean;

  /** 面板标题 */
  title?: ReactNode;
}

/** ShareSheet 选项选择结果 */
interface ShareSheetResult {
  /** 选中项在所在行内的下标 */
  index: number;

  /** 选中的选项 */
  option: ShareSheetOption;

  /** 选中项所在行的下标，单行写法恒为 0 */
  rowIndex: number;
}

/**
 * ShowShareSheet 函数调用选项
 *
 * 展示状态由内部的 Renderer 托管，所以 show / defaultShow / onUpdateShow / onClosed 不再开放。
 */
interface ShareSheetCallOptions extends Omit<ShareSheetProps, 'defaultShow' | 'onClosed' | 'onUpdateShow' | 'show'> {
  /** 选中或取消后的通用回调，与 Promise 一同结算，且恰好触发一次 */
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
