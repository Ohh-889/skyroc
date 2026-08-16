import type { ReactNode } from 'react';

/** 宫格排列方向 */
type GridDirection = 'horizontal' | 'vertical';

/** GridItem 可定制的样式插槽 */
type GridItemSlots = 'content' | 'iconSlot' | 'text';

/** 单个宫格项数据 */
interface GridItemData {
  /** 自定义子元素（优先级高于 icon + text） */
  children?: ReactNode;

  /** 自定义内容区域样式 */
  className?: string;

  /** 各插槽的自定义样式 */
  classNames?: Partial<Record<GridItemSlots, string>>;

  /** 图标区域内容 */
  icon?: ReactNode;

  /** 唯一标识（缺省时使用数组索引） */
  key?: string;

  /** 点击事件 */
  onPress?: () => void;

  /** 文字内容（字符串会自动包裹 Text） */
  text?: ReactNode;
}

interface GridProps {
  /** 是否显示边框 */
  border?: boolean;

  /** 是否居中显示内容 */
  center?: boolean;

  /** 是否可点击（影响全部子项交互反馈） */
  clickable?: boolean;

  /** 列数 */
  columnNum?: number;

  /** 内容排列方向 */
  direction?: GridDirection;

  /** 格子间距（单位 px） */
  gutter?: number;

  /** 宫格数据项 */
  items: GridItemData[];

  /** 是否翻转图标与文字的顺序 */
  reverse?: boolean;

  /** 是否将格子固定为正方形 */
  square?: boolean;
}

export type { GridDirection, GridItemData, GridItemSlots, GridProps };
