import type { ReactNode, Ref } from 'react';
import type { ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types/shared';

/** 索引栏子项数据 */
interface IndexBarChild {
  /** 唯一标识 */
  key: string;

  /** 显示文本 */
  text: string;
}

/** 索引栏分组数据 */
interface IndexBarSection {
  /** 分组子项列表 */
  children: IndexBarChild[];

  /** 索引字母，同时是分组标题与侧栏上的那个字符，所以必须在 items 内唯一 */
  title: string;
}

/** IndexBar 暴露方法 */
interface IndexBarRef {
  /** 定位到指定索引，行为与点击侧栏一致（滚动 + 更新高亮）；`index` 不在 items 中时静默忽略 */
  scrollToIndex: (index: string) => void;
}

/** 插槽名称 */
type IndexBarSlots =
  | 'content'
  | 'item'
  | 'itemText'
  | 'root'
  | 'sectionHeader'
  | 'sectionHeaderText'
  | 'separator'
  | 'sidebar'
  | 'sidebarItem'
  | 'sidebarItemText';

/** IndexBar 组件属性 */
interface IndexBarProps extends Omit<ViewProps, 'children'> {
  /** Uniwind className，作用于根节点 */
  className?: string;

  /** 各插槽自定义 className；`separator` 不要改线条粗细，那是滚动定位的度量之一 */
  classNames?: SlotClassNames<IndexBarSlots>;

  /** 点击侧栏索引时是否触发轻触反馈，默认 true */
  haptic?: boolean;

  /**
   * 子项高度，默认 40。
   *
   * 不只是样式：滚动定位按这个值累加，组件也会把它强制套在每个子项外层， 所以自定义渲染的内容必须能在这个高度内显示完整。
   */
  itemHeight?: number;

  /** 分组数据，顺序即侧栏索引顺序 */
  items: IndexBarSection[];

  /** 激活索引变化回调，点击侧栏与滚动联动都会触发，回调参数是该分组的 `title` */
  onIndexChange?: (index: string) => void;

  /** 点击子项回调；传了 `renderItem` 时不生效，点击交互由自定义内容自行处理 */
  onPressItem?: (item: IndexBarChild) => void;

  /** 组件 ref，用于命令式定位 */
  ref?: Ref<IndexBarRef>;

  /** 自定义子项渲染，外层仍会套上 `itemHeight` 的固定高度 */
  renderItem?: (item: IndexBarChild, section: IndexBarSection) => ReactNode;

  /** 分组标题高度，默认 32；与 `itemHeight` 一样参与滚动定位的计算 */
  sectionHeaderHeight?: number;

  /** 是否开启分组标题吸顶，默认 true */
  sticky?: boolean;
}

export type { IndexBarChild, IndexBarProps, IndexBarRef, IndexBarSection, IndexBarSlots };
