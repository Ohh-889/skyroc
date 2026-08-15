import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * 头像样式变体。
 *
 * Avatar 直接渲染成一个 Image，`root` 就是 Image 的 root——它是唯一的尺寸承载者，图片与 fallback 都相对它铺满， 所以 `size` 只需要作用在 `root` 与 `fallbackText`
 * 上，不必逐 slot 复制一份尺寸表。
 *
 * 圆角与 overflow 由 Image 的 `radius="full"` 提供；`fallback` 的底色与居中来自 Image 的 error slot， 两者都不在这里重复声明。
 */
export const avatarVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    fallbackText: 'font-medium text-muted-foreground',
    /** 图片自身也补一层圆角：Android 上父级 overflow-hidden + borderRadius 偶发裁剪失效，会漏出方角 */
    image: 'rounded-full',
    /** 底色让图片加载完成前先占住一块中性圆盘，避免透明空洞 */
    root: 'shrink-0 bg-muted'
  },
  variants: {
    size: {
      '2xl': { fallbackText: 'text-xl', root: 'size-16' },
      lg: { fallbackText: 'text-base', root: 'size-12' },
      md: { fallbackText: 'text-sm', root: 'size-10' },
      sm: { fallbackText: 'text-xs', root: 'size-8' },
      xl: { fallbackText: 'text-lg', root: 'size-14' },
      xs: { fallbackText: 'text-2xs', root: 'size-6' }
    }
  }
});

export type AvatarVariantProps = VariantProps<typeof avatarVariants>;

/**
 * 头像组样式变体。
 *
 * `item` 是每个子项外层包装的负 margin，用来把后一个头像叠到前一个身上——RN 里没有 `> * + *` 选择器， Tailwind 的 space-x 不可用，只能逐项包一层 View 施加，且首项要跳过。
 *
 * `ring` 由 AvatarGroup 经 Context 注入到每个子 Avatar 的 root 上：叠在一起的圆形之间需要一圈背景色描边才分得开， 与 Badge 的 `border-background` 同一套路。RN 是
 * border-box，描边向内吃掉图片，不会撑大头像尺寸。
 */
export const avatarGroupVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    item: '',
    ring: 'border-background',
    root: 'flex-row items-center'
  },
  variants: {
    size: {
      // 负 margin 约取尺寸的 25%，保证叠压比例不随 size 漂移
      '2xl': { item: '-ml-4', ring: 'border-2' },
      lg: { item: '-ml-3', ring: 'border-2' },
      md: { item: '-ml-2.5', ring: 'border-2' },
      sm: { item: '-ml-2', ring: 'border-2' },
      xl: { item: '-ml-3.5', ring: 'border-2' },
      // 24px 的头像上 2px 描边占比过重，降一档
      xs: { item: '-ml-1.5', ring: 'border' }
    }
  }
});

export type AvatarGroupVariantProps = VariantProps<typeof avatarGroupVariants>;
