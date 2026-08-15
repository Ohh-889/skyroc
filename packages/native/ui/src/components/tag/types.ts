import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { TagVariantProps } from './tag-variants';

/** Tag 颜色 */
export type TagColor = NonNullable<TagVariantProps['color']>;

/** Tag 变体 */
export type TagVariant = NonNullable<TagVariantProps['variant']>;

/** Tag 尺寸 */
export type TagSize = NonNullable<TagVariantProps['size']>;

/** Tag 形状 */
export type TagShape = NonNullable<TagVariantProps['shape']>;

/** Tag 组件属性 */
export interface TagProps extends ViewProps, TagVariantProps {
  /** Tag 内容，string 类型自动包裹 Text */
  children?: ReactNode;

  /** NativeWind 类名 */
  className?: string;

  /** 是否可关闭 */
  closeable?: boolean;

  /** 关闭事件 */
  onClose?: () => void;
}
