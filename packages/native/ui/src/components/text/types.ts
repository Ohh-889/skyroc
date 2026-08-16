import type { Ref } from 'react';
import type { Text as RNText, TextProps as RNTextProps } from 'react-native';
import type { TextVariantProps } from './text-variants';

/** 文本组件属性 */
export interface TextProps extends RNTextProps, TextVariantProps {
  /** 是否作为子组件插槽渲染，用于 @rn-primitives 组合模式 */
  asChild?: boolean;

  className?: string;

  /** 底层 Text 的 ref，用于 measure / 滚动定位等命令式操作；asChild 时转发到被插槽替换的子元素 */
  ref?: Ref<RNText>;
}
