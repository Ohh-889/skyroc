import { tv } from 'tailwind-variants';

export const avatarVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    fallback: 'flex justify-center items-center size-full rounded-full bg-muted font-medium',
    image: 'aspect-square size-full object-cover',
    root: 'relative flex shrink-0 overflow-hidden rounded-full'
  },
  variants: {
    size: {
      '2xl': {
        root: 'size-16'
      },
      'lg': {
        root: 'size-12'
      },
      'md': {
        root: 'size-10'
      },
      'sm': {
        root: 'size-8'
      },
      'xl': {
        root: 'size-14'
      },
      'xs': {
        root: 'size-6'
      }
    }
  }
});

export type AvatarSlots = keyof typeof avatarVariants.slots;
