import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const badgeVariants = tv({
  defaultVariants: {
    color: 'primary',
    position: 'top-right',
    size: 'md'
  },
  slots: {
    content: `absolute flex justify-center items-center whitespace-nowrap rounded-full transform`,
    root: 'relative'
  },
  variants: {
    color: {
      accent: {
        content: 'bg-accent text-accent-foreground'
      },
      carbon: {
        content: 'bg-carbon text-carbon-foreground'
      },
      destructive: {
        content: 'bg-destructive text-destructive-foreground'
      },
      info: {
        content: 'bg-info text-info-foreground'
      },
      primary: {
        content: 'bg-primary text-primary-foreground'
      },
      secondary: {
        content: 'bg-secondary text-secondary-foreground'
      },
      success: {
        content: 'bg-success text-success-foreground'
      },
      warning: {
        content: 'bg-warning text-warning-foreground'
      }
    },
    position: {
      'bottom-left': {
        content: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2'
      },
      'bottom-right': {
        content: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2'
      },
      'top-left': {
        content: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2'
      },
      'top-right': {
        content: 'right-0 top-0 translate-x-1/2 -translate-y-1/2'
      }
    },
    size: {
      '2xl': {
        content: `min-h-5 px-2.5 text-base leading-relaxed`
      },
      'lg': {
        content: `min-h-3.5 px-1.75 text-xs leading-relaxed`
      },
      'md': {
        content: `min-h-3 px-1.5 text-2xs leading-relaxed`
      },
      'sm': {
        content: `min-h-2.5 px-1.25 text-3xs leading-relaxed`
      },
      'xl': {
        content: `min-h-4 px-2 text-sm leading-relaxed`
      },
      'xs': {
        content: `min-h-2 px-1 text-4xs leading-relaxed`
      }
    }
  }
});

type BadgeVariants = VariantProps<typeof badgeVariants>;

export type BadgePosition = NonNullable<BadgeVariants['position']>;

export type BadgeSlots = keyof typeof badgeVariants.slots;
