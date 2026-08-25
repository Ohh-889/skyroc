import type { ThemeAlign, ThemeOrientation } from '@skyroc/tailwind-plugin/ui';
import type { ReactNode, Ref } from 'react';
import type { View, ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { DividerVariantProps } from './divider-variants';

/** 分割线线型 */
export type DividerBorder = NonNullable<DividerVariantProps['border']>;

/** 内容在分割线上的位置 */
export type DividerAlign = ThemeAlign;

/** 分割线方向 */
export type DividerOrientation = ThemeOrientation;

/** Divider 可覆盖的 slot 名称，leading / trailing 分别指内容前后的那半截线条 */
export type DividerSlots = 'line' | 'lineLeading' | 'lineTrailing' | 'root' | 'text';

/** Divider 组件属性 */
export interface DividerProps extends ViewProps, DividerVariantProps {
  /** 内容位置，start / end 会把内容那一侧的线条压到 10%，需要别的比例时覆盖 classNames.lineLeading */
  align?: DividerAlign;

  /** 线型，dashed / dotted 走边框绘制 */
  border?: DividerBorder;

  /** 分割线中间的内容，字符串会自动包一层 Text；横向纵向都支持 */
  children?: ReactNode;

  /** 自定义容器类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<DividerSlots>;

  /**
   * 是否使用 1 物理像素的细线（0.5/0.33dp），关掉是 1dp。
   *
   * 仅对 solid 生效，dashed / dotted 固定 1dp；开启时通过 style 生效，会盖掉 classNames 里的粗细类
   */
  hairline?: boolean;

  /** 分割线方向，vertical 依赖父级为横向布局且有确定高度，否则线条高度为 0 */
  orientation?: DividerOrientation;

  /** 底层 View 的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;
}
