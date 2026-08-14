import type { ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import type { ButtonVariantProps } from './button-variants';

/** 按钮颜色 */
export type ButtonColor = NonNullable<ButtonVariantProps['color']>;

/** 按钮变体 */
export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;

/** 按钮尺寸 */
export type ButtonSize = NonNullable<ButtonVariantProps['size']>;

/** 按钮形状 */
export type ButtonShape = NonNullable<ButtonVariantProps['shape']>;

/** 按钮组件属性 */
export interface ButtonProps extends Omit<PressableProps, 'children'>, ButtonVariantProps {
  /** 按钮内容，string 类型自动包裹 Text */
  children?: ReactNode;

  /** NativeWind 类名 */
  className?: string;

  /** 前置内容（图标等），显示在文字之前 */
  leading?: ReactNode;

  /** 加载状态，为 true 时显示 loading 指示器且不可点击 */
  loading?: boolean;

  /** 自定义文字 className，合并到 TextClassContext */
  textClassName?: string;

  /** 后置内容（图标等），显示在文字之后 */
  trailing?: ReactNode;
}
