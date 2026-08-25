import type { ThemeColor } from '@skyroc/tailwind-plugin/ui';
import type { ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';

/** Rate 组件可覆盖的 slot 名称 */
export type RateSlots = 'icon' | 'item' | 'root' | 'voidIcon';

/**
 * 星星图标。
 *
 * 传函数时按星索引与是否点亮动态返回节点。自定义图标的实际宽度必须与 `size` 一致， 否则半星遮罩按 `size` 裁剪会与图标错位。
 */
export type RateIcon = ReactNode | ((index: number, active: boolean) => ReactNode);

/** 评分组件属性 */
export interface RateProps {
  /** 是否允许半星，开启后单颗星左半区选半星、右半区选满星 */
  allowHalf?: boolean;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名，`icon` / `voidIcon` 作用于矢量图标的 colorClassName，只接受 `accent-*` 颜色类 */
  classNames?: SlotClassNames<RateSlots>;

  /** 是否允许再次点中当前分值时清零 */
  clearable?: boolean;

  /** 点亮星星的主题色 */
  color?: ThemeColor;

  /** 星星总数，非整数向下取整 */
  count?: number;

  /** 默认分值（非受控） */
  defaultValue?: number;

  /** 是否禁用，禁用后整体置灰且不响应点击 */
  disabled?: boolean;

  /** 星星间距（px） */
  gutter?: number;

  /** 点亮态图标，缺省为实心星 */
  icon?: RateIcon;

  /** 分值变化回调 */
  onChange?: (value: number) => void;

  /** 是否只读，只读时不响应点击；配合 allowHalf 可渲染 3.7 星这类任意小数 */
  readonly?: boolean;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 图标边长（px），同时是半星遮罩的裁剪基准 */
  size?: number;

  /** 当前分值（受控） */
  value?: number;

  /** 未点亮态图标，缺省为空心星 */
  voidIcon?: RateIcon;
}
