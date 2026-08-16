import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types/shared';

/** 侧边栏单项配置 */
interface SidebarItem {
  /** 徽标内容 */
  badge?: ReactNode;

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否显示小红点 */
  dot?: boolean;

  /** 唯一标识 */
  key: string;

  /** 标题 */
  title: ReactNode;
}

/** 侧边栏插槽名称 */
type SidebarSlots = 'content' | 'indicator' | 'item' | 'itemText' | 'root';

/** Sidebar 组件属性 */
interface SidebarProps extends Omit<ViewProps, 'children'> {
  /** 受控当前激活索引；索引是位置而非身份，items 增删或重排后需要调用方自行校正 */
  activeIndex?: number;

  /** NativeWind className，作用于根节点（scrollable 时即 ScrollView 本身） */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<SidebarSlots>;

  /** 非受控默认激活索引 */
  defaultActiveIndex?: number;

  /** 侧边栏项数据 */
  items: SidebarItem[];

  /** 激活项变化回调，同时给出该项配置，便于按 key 而非下标持久化选中态 */
  onIndexChange?: (index: number, item: SidebarItem) => void;

  /**
   * 内容超出高度时是否可纵向滚动，默认 true。
   *
   * 置为 false 时根节点退化成普通 View，用于外层已经有滚动容器、不希望嵌套滚动的场景。
   */
  scrollable?: boolean;
}

export type { SidebarItem, SidebarProps, SidebarSlots };
