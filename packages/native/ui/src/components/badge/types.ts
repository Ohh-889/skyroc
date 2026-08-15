import type { ReactNode, Ref } from 'react';
import type { View, ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { BadgeVariantProps } from './badge-variants';

/** Badge 颜色 */
export type BadgeColor = NonNullable<BadgeVariantProps['color']>;

/** Badge 尺寸 */
export type BadgeSize = NonNullable<BadgeVariantProps['size']>;

/** 角标相对 children 的挂载角落 */
export type BadgePosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

/** Badge 组件可覆盖的 slot 名称 */
export type BadgeSlots = 'badge' | 'content' | 'dot' | 'root';

/** Badge 组件属性 */
export interface BadgeProps extends ViewProps, BadgeVariantProps {
  /** 被角标标记的内容，省略时角标独立成块渲染（此时 className / style 等直接作用于角标本身） */
  children?: ReactNode;

  /** NativeWind 类名，包裹模式合并到 root slot，独立模式合并到角标自身 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<BadgeSlots>;

  /** 角标内容，number / string 自动包裹 Text，ReactElement 原样渲染 */
  content?: ReactNode;

  /** 只渲染一个小圆点，忽略 content */
  dot?: boolean;

  /** 数字封顶值，content 超过时显示 `{max}+` */
  max?: number;

  /** 在默认角落位置上做像素微调 [x, y]，x 向右为正、y 向下为正 */
  offset?: [number, number];

  /** 包裹 children 时角标挂载的角落 */
  position?: BadgePosition;

  /** 底层 View 的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Content 为 0 时是否仍然展示角标 */
  showZero?: boolean;
}
