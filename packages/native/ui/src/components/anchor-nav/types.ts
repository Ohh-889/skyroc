import type { ReactNode, Ref } from 'react';
import type { ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types/shared';
import type { SidebarProps } from '../sidebar/types';

/** 锚点导航子项数据 */
interface AnchorNavChild {
  /** 唯一标识 */
  key: string;

  /** 显示文本 */
  text: string;
}

/** 锚点导航分组数据 */
interface AnchorNavSection {
  /** 徽标内容，显示在侧栏对应项上 */
  badge?: ReactNode;

  /** 子项列表 */
  children: AnchorNavChild[];

  /** 是否禁用，只作用于侧栏该项——禁用后无法点击跳转，滚动联动仍会高亮 */
  disabled?: boolean;

  /** 是否在侧栏对应项显示小红点 */
  dot?: boolean;

  /** 唯一标识，只用于侧栏列表的 key；不传时回退到下标，分组会动态增删时建议传 */
  key?: string;

  /** 分组标题 */
  title: string;
}

/** AnchorNav 暴露方法 */
interface AnchorNavRef {
  /**
   * 定位到指定分组，行为与点击侧栏一致（滚动 + 更新激活索引）。
   *
   * 受控用法里 `activeIndex` 只负责高亮，不驱动滚动——外部要跳转就走这个方法， 免得让「改 prop」和「滚动联动改 prop」互相打架。
   */
  scrollToSection: (index: number) => void;
}

/** 自定义侧栏渲染时拿到的上下文 */
interface AnchorNavSidebarContext {
  /** 当前激活分组索引 */
  activeIndex: number;

  /** 分组数据，与传入的 `items` 是同一份引用 */
  items: AnchorNavSection[];

  /** 定位到指定分组，与点击默认侧栏走的是同一条路径（滚动 + 高亮 + 触感），自定义侧栏不要另起一套 */
  onPressIndex: (index: number) => void;
}

/** 插槽名称 */
type AnchorNavSlots =
  | 'content'
  | 'item'
  | 'itemText'
  | 'root'
  | 'sectionHeader'
  | 'sectionHeaderText'
  | 'separator'
  | 'sidebar';

/** AnchorNav 组件属性 */
interface AnchorNavProps extends Omit<ViewProps, 'children'> {
  /** 受控激活分组索引；索引是位置而非身份，items 增删或重排后需要调用方自行校正 */
  activeIndex?: number;

  /** Uniwind className，作用于根节点 */
  className?: string;

  /** 各插槽自定义 className；`separator` 不要改线条粗细，那是滚动定位的度量之一；传了 `renderSidebar` 时 `sidebar` 不生效 */
  classNames?: SlotClassNames<AnchorNavSlots>;

  /** 非受控默认激活分组索引 */
  defaultActiveIndex?: number;

  /** 点击侧栏时是否触发轻触反馈，默认 true */
  haptic?: boolean;

  /**
   * 子项高度，默认 64。
   *
   * 不只是样式：点击侧栏的定位与滚动联动的反查都按这个值累加，组件也会把它强制套在每个子项外层， 所以自定义渲染的内容必须能在这个高度内显示完整。
   */
  itemHeight?: number;

  /** 分组数据 */
  items: AnchorNavSection[];

  /** 激活分组变化回调，点击侧栏与滚动联动都会触发 */
  onIndexChange?: (index: number) => void;

  /** 点击子项回调；传了 `renderItem` 时不生效，点击交互由自定义内容自行处理 */
  onPressItem?: (item: AnchorNavChild) => void;

  /** 组件 ref，用于命令式定位 */
  ref?: Ref<AnchorNavRef>;

  /** 自定义子项渲染，外层仍会套上 `itemHeight` 的固定高度 */
  renderItem?: (item: AnchorNavChild, section: AnchorNavSection) => ReactNode;

  /**
   * 自定义侧栏渲染，传了就完全取代默认的 `Sidebar`——`sidebarClassNames` 与 `classNames.sidebar` 随之失效， 自定义节点自己管样式。滚动定位、高亮联动、触感这些仍由
   * AnchorNav 统一负责，通过入参拿。
   *
   * 节点排在列表**之后**：常规流里就是列表右侧的一列，绝对定位则悬浮在列表之上。 靠的是绘制顺序而不是 zIndex——后者在 Android 上不总可靠。
   */
  renderSidebar?: (context: AnchorNavSidebarContext) => ReactNode;

  /** 分组标题高度，默认 32；与 `itemHeight` 一样参与滚动定位的计算 */
  sectionHeaderHeight?: number;

  /** 侧栏内部各插槽自定义 className；侧栏根节点用 `classNames.sidebar`；传了 `renderSidebar` 时不生效 */
  sidebarClassNames?: SidebarProps['classNames'];

  /** 是否开启分组标题吸顶，默认 true */
  sticky?: boolean;
}

export type { AnchorNavChild, AnchorNavProps, AnchorNavRef, AnchorNavSection, AnchorNavSidebarContext, AnchorNavSlots };
