import type { ReactNode, Ref } from 'react';
import type { View, ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { TagVariantProps } from './tag-variants';

/** Tag 颜色 */
export type TagColor = NonNullable<TagVariantProps['color']>;

/** Tag 变体 */
export type TagVariant = NonNullable<TagVariantProps['variant']>;

/** Tag 尺寸 */
export type TagSize = NonNullable<TagVariantProps['size']>;

/** Tag 形状 */
export type TagShape = NonNullable<TagVariantProps['shape']>;

/** Tag 组件可覆盖的 slot 名称 */
export type TagSlots = 'close' | 'closeIcon' | 'root' | 'text';

/** Tag 组件属性 */
export interface TagProps extends ViewProps, TagVariantProps {
  /** Tag 内容，string / number 类型自动包裹 Text，其余节点通过 TextClassContext 继承文字色 */
  children?: ReactNode;

  /** NativeWind 类名，合并到 root slot */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<TagSlots>;

  /** 是否可关闭，为 true 时在末尾渲染关闭按钮 */
  closeable?: boolean;

  /** 关闭按钮的无障碍标签，读屏朗读该文案 */
  closeAccessibilityLabel?: string;

  /** 前置内容（图标等），显示在文字之前 */
  leading?: ReactNode;

  /** 关闭事件 */
  onClose?: () => void;

  /** 底层 View 的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;
}
