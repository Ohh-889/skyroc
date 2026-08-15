import type { ImageProps } from '../image/types';
import type { AvatarVariantProps } from './avatar-variants';

/** 头像组件属性 */
export interface AvatarProps extends AvatarVariantProps {
  /** 自定义头像容器类名 */
  className?: string;

  /** 图片加载失败时的降级内容，通常是首字母或图标 */
  fallback?: React.ReactNode;

  /** 自定义 fallback 容器类名 */
  fallbackClassName?: string;

  /** 自定义图片类名 */
  imageClassName?: string;

  /** 透传给内部 Image 的额外属性 */
  imageProps?: Omit<ImageProps, 'className' | 'src'>;

  /** 图片源，支持字符串 URL 或标准 source 对象 */
  src?: ImageProps['src'];
}
