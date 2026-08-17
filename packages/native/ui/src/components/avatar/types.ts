import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';
import type { ImageProps } from '../image/types';
import type { AvatarGroupVariantProps, AvatarVariantProps } from './avatar-variants';

/** Avatar 尺寸 */
export type AvatarSize = NonNullable<AvatarVariantProps['size']>;

/** Avatar 组件可覆盖的 slot 名称 */
export type AvatarSlots = 'fallback' | 'fallbackText' | 'image' | 'root';

/** 头像组件属性 */
export interface AvatarProps extends AvatarVariantProps {
  /** 无障碍描述，透传给底层图片 */
  alt?: string;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<AvatarSlots>;

  /**
   * Src 为空或图片加载失败时的降级内容，通常是首字母或图标。
   *
   * String / number 自动包裹 Text 并套用 fallbackText 的字号；不传时回落到 Image 内置的破损图标。
   */
  fallback?: ReactNode;

  /** 透传给内部 Image 的额外属性；类名、图片源与降级内容由 Avatar 自身的 API 接管，故排除在外 */
  imageProps?: Omit<ImageProps, 'alt' | 'className' | 'classNames' | 'errorSlot' | 'src'>;

  /** 图片源，支持字符串 URL 或标准 source 对象，为空时直接展示 fallback */
  src?: ImageProps['src'];
}

/** AvatarGroup 组件可覆盖的 slot 名称 */
export type AvatarGroupSlots = 'item' | 'ring' | 'root';

/** AvatarGroup 向子 Avatar 下发的共享配置 */
export interface AvatarGroupContextValue {
  /** 叠压时的分隔描边类名，合并到子 Avatar 的 root */
  ringClassName?: string;

  /** 组内统一尺寸，子 Avatar 显式传 size 时以子项为准 */
  size?: AvatarSize;
}

/** 头像组组件属性 */
export interface AvatarGroupProps extends AvatarGroupVariantProps {
  /** 组内的 Avatar 子项 */
  children?: ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<AvatarGroupSlots>;

  /** 最多展示几个头像，超出部分折叠成一个 +N；不传或小于等于 0 表示全部展示 */
  max?: number;

  /** 透传给 +N 头像的属性，传 fallback 可整体替换 +N 的内容 */
  overflowProps?: Omit<AvatarProps, 'src'>;

  /**
   * 参与计数的总人数，默认取 children 的数量。
   *
   * 用于「后端只返回前几条、但知道总数」的场景：传 3 个 Avatar 配 `total={20}`，尾部就会显示 +17。
   */
  total?: number;
}
