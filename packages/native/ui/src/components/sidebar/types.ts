import type { ReactNode } from 'react';
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
type SidebarSlots = 'indicator' | 'item' | 'itemText' | 'root';

/** Sidebar 组件属性 */
interface SidebarProps {
  /** 受控当前激活索引 */
  activeIndex?: number;

  /** NativeWind className */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<SidebarSlots>;

  /** 非受控默认激活索引 */
  defaultActiveIndex?: number;

  /** 侧边栏项数据 */
  items: SidebarItem[];

  /** 激活索引变化回调 */
  onIndexChange?: (index: number) => void;
}

export type { SidebarItem, SidebarProps, SidebarSlots };
