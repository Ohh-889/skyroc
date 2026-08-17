import type { ReactNode, Ref } from 'react';
import type { PressableProps, View } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { ButtonVariantProps } from './button-variants';

/** Button 组件可覆盖的 slot 名称，`indicator` 为 loading 指示器 */
export type ButtonSlots = 'indicator' | 'root' | 'text';

/** 按钮颜色 */
export type ButtonColor = NonNullable<ButtonVariantProps['color']>;

/** 按钮变体 */
export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;

/** 按钮尺寸 */
export type ButtonSize = NonNullable<ButtonVariantProps['size']>;

/** 按钮形状 */
export type ButtonShape = NonNullable<ButtonVariantProps['shape']>;

/** 按钮公共属性，size 由各分支单独声明 */
export interface ButtonProps extends Omit<PressableProps, 'children'>, ButtonVariantProps {
  /** 按钮内容，string / number 类型自动包裹 Text */
  children?: ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className，`indicator` 作用于 loading 指示器的 colorClassName，只接受 `accent-*` 颜色类 */
  classNames?: SlotClassNames<ButtonSlots>;

  /** 前置内容（图标等），显示在文字之前 */
  leading?: ReactNode;

  /** 加载状态，为 true 时以 loading 指示器替换 leading 且不可点击 */
  loading?: boolean;

  /** 底层 Pressable 的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 后置内容（图标等），显示在文字之后 */
  trailing?: ReactNode;
}

