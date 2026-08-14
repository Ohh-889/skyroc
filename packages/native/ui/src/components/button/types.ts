import type { ReactNode, Ref } from 'react';
import type { PressableProps, View } from 'react-native';
import type { ButtonVariantProps } from './button-variants';

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

  /** NativeWind 类名 */
  className?: string;

  /** 前置内容（图标等），显示在文字之前 */
  leading?: ReactNode;

  /** 加载状态，为 true 时以 loading 指示器替换 leading 且不可点击 */
  loading?: boolean;

  /** 底层 Pressable 的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** 自定义文字 className，合并到 TextClassContext */
  textClassName?: string;

  /** 后置内容（图标等），显示在文字之后 */
  trailing?: ReactNode;
}

