import type { ReactNode, Ref } from 'react';
import type { BottomSheetModal, BottomSheetModalProps } from '@gorhom/bottom-sheet';
import type { SlotClassNames } from '../../types';

/** Sheet 组件可覆盖的 slot 名称 */
export type SheetSlots =
  | 'background'
  | 'chrome'
  | 'close'
  | 'closeIcon'
  | 'description'
  | 'handle'
  | 'handleBar'
  | 'header'
  | 'title';

/**
 * 从 BottomSheetModalProps 中排除的属性，由 Sheet 内部管理。
 *
 * 这些属性一旦从外部透传就会覆盖内部实现：onDismiss 被覆盖会让 onUpdateShow 永远不触发，
 * 父级的 show 卡在 true，面板再也无法重新打开；handleComponent 承载的是标题栏，
 * backgroundComponent 承载的是圆角与底色。
 */
type SheetOmitProps =
  | 'backdropComponent'
  | 'backgroundComponent'
  | 'children'
  | 'enableDynamicSizing'
  | 'handleComponent'
  | 'onDismiss'
  | 'ref'
  | 'snapPoints';

/** Sheet 底部面板组件属性 */
export interface SheetProps extends Omit<Partial<BottomSheetModalProps>, SheetOmitProps> {
  /**
   * 面板内容，必须自带 gorhom 的容器组件。
   *
   * 普通内容用 `BottomSheetView`，长列表用 `BottomSheetFlatList` / `BottomSheetScrollView`。
   * Sheet 不再代为包裹：外层若套一层 BottomSheetView，它的 effect 会在子组件之后把
   * scrollable 注册覆盖成 VIEW 类型，内层列表的滚动手势就被吞掉了。
   *
   * 底部安全区同理交给容器处理——列表要把留白写进 contentContainerStyle 才能跟着滚动，
   * 写在外层容器上只会压缩滚动视口。
   */
  children?: ReactNode;

  /** 面板本体（背景 + 圆角）的自定义类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<SheetSlots>;

  /** 是否显示关闭按钮 */
  closeable?: boolean;

  /** 是否允许点击遮罩关闭，默认 true */
  closeOnBackdropPress?: boolean;

  /** 描述信息，显示在标题下方，与标题同属顶部固定区 */
  description?: ReactNode;

  /** 是否允许下拉关闭 */
  enablePanDownToClose?: boolean;

  /** 显示状态变化回调；必填，否则下拉 / 点遮罩关闭后 show 无人置为 false，面板会卡死 */
  onUpdateShow: (show: boolean) => void;

  /**
   * 底层 BottomSheetModal 的实例引用。
   *
   * Sheet 自己也要用它来做 present / dismiss，所以内外两个 ref 用 useComposedRefs 合成； 拿到后可以调 snapToIndex / expand /
   * collapse 等 show 表达不了的命令式操作。
   */
  ref?: Ref<BottomSheetModal>;

  /** 是否显示面板 */
  show: boolean;

  /** 是否显示拖拽指示条 */
  showHandle?: boolean;

  /** 吸附点，如 ['25%', '50%']；不传则按内容高度动态撑开 */
  snapPoints?: BottomSheetModalProps['snapPoints'];

  /** 面板标题 */
  title?: ReactNode;
}
