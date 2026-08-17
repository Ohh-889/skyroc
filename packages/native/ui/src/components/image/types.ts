import type { ImageProps as EXImageProps } from 'expo-image';
import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';
import type { ImageVariantProps } from './image-variants';

/** Image 圆角档位 */
export type ImageRadius = NonNullable<ImageVariantProps['radius']>;

/** Image 组件可覆盖的 slot 名称 */
export type ImageSlots = 'error' | 'image' | 'indicator' | 'loading' | 'root';

/**
 * 图片源。
 *
 * 直接复用 expo-image 的 source 全量能力（多分辨率数组、blurhash、`sf:` 符号、带 headers 的鉴权图等）， 额外接受裸字符串作为语法糖，内部包装成
 * `{ uri }`。
 */
export type ImageSource = NonNullable<EXImageProps['source']> | string;

/** 图片组件属性 */
export interface ImageProps extends Omit<EXImageProps, 'source'>, ImageVariantProps {
  /**
   * Uniwind 类名，合并到 root slot。
   *
   * 图片铺满 root，所以尺寸必须给在这里（如 `h-20 w-20`）——不给尺寸时 root 高度为 0，图片不可见。
   */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<ImageSlots>;

  /** 加载失败时的占位内容，不传则使用内置的破损图片图标 */
  errorSlot?: ReactNode;

  /** 加载中时的占位内容，不传则使用内置的 ActivityIndicator */
  loadingSlot?: ReactNode;

  /** 是否显示加载失败占位 */
  showError?: boolean;

  /** 是否显示加载中占位 */
  showLoading?: boolean;

  /** 图片源，为空时直接按加载失败处理 */
  src?: ImageSource;
}
