// @unocss-include
import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const switchVariants = tv({
  base: [],
  defaultVariants: {
    color: 'primary',
    shape: 'rounded',
    size: 'md'
  },
  slots: {
    root: [
      `peer shrink-0 inline-flex items-center rounded-full border-0 shadow-sm transition-colors duration-200`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
      `disabled:cursor-not-allowed disabled:opacity-50`,
      `data-[state=unchecked]:bg-input`
    ],
    thumb: `flex justify-center items-center rounded-full shadow-lg transition-transform duration-200 bg-background cursor-not-allowed data-[state=unchecked]:translate-x-0.5`
  },
  variants: {
    color: {
      accent: {
        root: `data-[state=checked]:bg-accent-foreground/20 focus-visible:ring-accent-foreground/20`
      },
      carbon: {
        root: `data-[state=checked]:bg-carbon focus-visible:ring-carbon`
      },
      destructive: {
        root: `data-[state=checked]:bg-destructive focus-visible:ring-destructive`
      },
      info: {
        root: `data-[state=checked]:bg-info focus-visible:ring-info`
      },
      primary: {
        root: `data-[state=checked]:bg-primary focus-visible:ring-primary`
      },
      secondary: {
        root: `data-[state=checked]:bg-secondary-foreground/20 focus-visible:ring-secondary-foreground/20`
      },
      success: {
        root: `data-[state=checked]:bg-success focus-visible:ring-success`
      },
      warning: {
        root: `data-[state=checked]:bg-warning focus-visible:ring-warning`
      }
    },
    shape: {
      rounded: {
        root: 'rounded-full',
        thumb: 'rounded-full'
      },
      square: {
        root: 'rounded-md',
        thumb: 'rounded-sm'
      }
    },
    size: {
      '2xl': {
        root: 'h-7 w-13',
        thumb: 'size-6 data-[state=checked]:translate-x-6.5'
      },
      'lg': {
        root: 'h-5.5 w-10',
        thumb: 'size-4.5 data-[state=checked]:translate-x-5'
      },
      'md': {
        root: 'h-5 w-9',
        thumb: 'size-4 data-[state=checked]:translate-x-4.5'
      },
      'sm': {
        root: 'h-4.5 w-8',
        thumb: 'size-3.5 data-[state=checked]:translate-x-4'
      },
      'xl': {
        root: 'h-6 w-11',
        thumb: 'size-5 data-[state=checked]:translate-x-5.5'
      },
      'xs': {
        root: 'h-4 w-7',
        thumb: 'size-3 data-[state=checked]:translate-x-3.5'
      }
    }
  }
});

type SwitchVariants = VariantProps<typeof switchVariants>;

export type SwitchSlots = keyof typeof switchVariants.slots;

export type SwitchShape = NonNullable<SwitchVariants['shape']>;
