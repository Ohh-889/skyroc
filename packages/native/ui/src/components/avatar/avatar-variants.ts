import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 头像样式变体 */
export const avatarVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    fallback: 'items-center justify-center rounded-full bg-muted',
    image: 'h-full w-full rounded-full',
    root: 'relative shrink-0 overflow-hidden rounded-full'
  },
  variants: {
    size: {
      '2xl': { fallback: 'size-16', root: 'size-16' },
      lg: { fallback: 'size-12', root: 'size-12' },
      md: { fallback: 'size-10', root: 'size-10' },
      sm: { fallback: 'size-8', root: 'size-8' },
      xl: { fallback: 'size-14', root: 'size-14' },
      xs: { fallback: 'size-6', root: 'size-6' }
    }
  }
});

/** 头像 fallback 文字大小映射 */
export const avatarFallbackTextSize = {
  '2xl': 'text-xl',
  lg: 'text-base',
  md: 'text-sm',
  sm: 'text-xs',
  xl: 'text-lg',
  xs: 'text-2xs'
} as const;

export type AvatarVariantProps = VariantProps<typeof avatarVariants>;
