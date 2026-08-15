import type { SlotClassNames } from '../../types';
import type { ImageProps } from '../image/types';
import type { AvatarVariantProps } from './avatar-variants';

/** Avatar 组件可覆盖的 slot 名称 */
export type AvatarSlots = 'fallback' | 'fallbackText' | 'image' | 'root';

/** 头像组件属性 */
export interface AvatarProps extends AvatarVariantProps {
  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<AvatarSlots>;

  /** 图片加载失败时的降级内容，通常是首字母或图标 */
  fallback?: React.ReactNode;

  /** 透传给内部 Image 的额外属性 */
  imageProps?: Omit<ImageProps, 'className' | 'src'>;

  /** 图片源，支持字符串 URL 或标准 source 对象 */
  src?: ImageProps['src'];
}
