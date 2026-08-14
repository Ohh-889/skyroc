import type { TextProps as RNTextProps } from 'react-native';
import type { TextVariantProps } from './text-variants';

/** 文本组件属性 */
export interface TextProps extends RNTextProps, TextVariantProps {
  /** 是否作为子组件插槽渲染，用于 @rn-primitives 组合模式 */
  asChild?: boolean;

  /** NativeWind 类名 */
  className?: string;
}
