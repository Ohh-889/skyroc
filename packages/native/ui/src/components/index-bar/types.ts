import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types/shared';

/** 索引栏子项数据 */
interface IndexBarChild {
  /** 唯一标识 */
  key: string;

  /** 显示文本 */
  text: string;
}

/** 索引栏分组数据 */
interface IndexBarItem {
  /** 分组子项列表 */
  data: IndexBarChild[];

  /** 锚点标题，默认使用 index */
  title: string;
}

/** 插槽名称 */
type IndexBarSlots =
  | 'anchor'
  | 'anchorText'
  | 'item'
  | 'itemText'
  | 'root'
  | 'separator'
  | 'sidebar'
  | 'sidebarItem'
  | 'sidebarItemText';

/** IndexBar 组件属性 */
interface IndexBarProps {
  /** NativeWind className */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<IndexBarSlots>;

  /** 索引列表，默认取 items 中的 index */
  indexList?: string[];

  /** 子项高度，默认 40 */
  itemHeight?: number;

  /** 分组数据 */
  items: IndexBarItem[];

  /** 滚动时活动索引变化回调 */
  onIndexChange?: (index: string) => void;

  /** 点击子项回调 */
  onPressItem?: (item: IndexBarChild) => void;

  /** 点击侧边索引回调 */
  onSelect?: (index: string) => void;

  /** 自定义子项渲染 */
  renderItem?: (item: IndexBarChild) => ReactNode;

  /** 分组标题高度，默认 32 */
  sectionHeaderHeight?: number;

  /** 是否开启锚点吸顶 */
  sticky?: boolean;
}

export type { IndexBarChild, IndexBarItem, IndexBarProps, IndexBarSlots };
