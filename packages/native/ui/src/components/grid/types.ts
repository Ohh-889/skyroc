import type { ReactNode, Ref } from 'react';
import type { View, ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { GridVariantProps } from './grid-variants';

/** 宫格排列方向 */
type GridDirection = 'horizontal' | 'vertical';

/** Grid 可覆盖的 slot 名称 */
type GridSlots = 'content' | 'icon' | 'item' | 'root' | 'text';

/** 单个格子可覆盖的 slot 名称，根节点只能由 Grid 自身的 classNames 覆盖 */
type GridItemSlots = Exclude<GridSlots, 'root'>;

/** 单个宫格项数据 */
interface GridItemData {
  /** 无障碍标签，未提供时读屏朗读子节点文本 */
  accessibilityLabel?: string;

  /** 自定义子元素（提供后忽略 icon 与 text） */
  children?: ReactNode;

  /** 覆盖该项各 slot 的类名 */
  classNames?: SlotClassNames<GridItemSlots>;

  /** 是否禁用交互，同时整体降低透明度 */
  disabled?: boolean;

  /** 图标区域内容 */
  icon?: ReactNode;

  /** 唯一标识，用作列表 key；增删重排时靠它保持节点身份 */
  key: string;

  /** 长按回调，与 onPress 一样会让该格子变成可点击的 Pressable */
  onLongPress?: () => void;

  /** 点击回调，未提供且 Grid 未开启 clickable 时渲染为不可点击的 View */
  onPress?: () => void;

  /** 测试标识 */
  testID?: string;

  /** 文字内容，string / number 自动包裹 Text */
  text?: ReactNode;
}

/** 宫格组件属性 */
interface GridProps extends Omit<ViewProps, 'children'>, Omit<GridVariantProps, 'disabled'> {
  /** 是否在格子之间显示分隔线；有 gutter 时分隔线落在间距中线 */
  border?: boolean;

  /** 内容是否在格子内居中 */
  center?: boolean;

  /** Uniwind className，作用于根节点 */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<GridSlots>;

  /** 是否让所有格子都可点击并带按压反馈；单项有 onPress / onLongPress 时无需开启 */
  clickable?: boolean;

  /** 列数 */
  columnNum?: number;

  /** 内容排列方向 */
  direction?: GridDirection;

  /** 格子之间的间距（单位 dp），以格子内边距实现，最外圈由容器负外边距抵消 */
  gutter?: number;

  /** 宫格数据项 */
  items: GridItemData[];

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 是否翻转图标与文字的顺序 */
  reverse?: boolean;

  /** 是否将格子内容区固定为正方形 */
  square?: boolean;
}

export type { GridDirection, GridItemData, GridItemSlots, GridProps, GridSlots };
