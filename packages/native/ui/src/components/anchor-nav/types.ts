import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types/shared';

/** 锚点导航子项数据 */
interface AnchorNavChild {
  /** 唯一标识 */
  key: string;

  /** 显示文本 */
  text: string;
}

/** 锚点导航分组数据 */
interface AnchorNavSection {
  /** 徽标内容 */
  badge?: ReactNode;

  /** 子项列表 */
  children: AnchorNavChild[];

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否显示小红点 */
  dot?: boolean;

  /** 分组标题 */
  title: string;
}

/** 插槽名称 */
type AnchorNavSlots = 'content' | 'item' | 'itemText' | 'root' | 'sectionHeader' | 'sectionHeaderText' | 'separator';

/** AnchorNav 组件属性 */
interface AnchorNavProps {
  /** 受控激活索引 */
  activeIndex?: number;

  /** NativeWind className */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<AnchorNavSlots>;

  /** 非受控默认激活索引 */
  defaultActiveIndex?: number;

  /** 组件高度 */
  height?: number;

  /** 子项高度，默认 64 */
  itemHeight?: number;

  /** 分组数据 */
  items: AnchorNavSection[];

  /** 激活索引变化回调 */
  onIndexChange?: (index: number) => void;

  /** 点击子项回调 */
  onPressItem?: (item: AnchorNavChild) => void;

  /** 自定义子项渲染 */
  renderItem?: (item: AnchorNavChild) => ReactNode;

  /** 分组标题高度，默认 32 */
  sectionHeaderHeight?: number;

  /** 是否开启锚点吸顶 */
  sticky?: boolean;
}

export type { AnchorNavChild, AnchorNavProps, AnchorNavSection, AnchorNavSlots };
