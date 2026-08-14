import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const textVariants = tv({
  base: 'text-foreground will-change-variable',
  defaultVariants: {
    size: 'md',
    weight: 'normal'
  },
  variants: {
    color: {
      accent: 'text-accent',
      destructive: 'text-destructive',
      foreground: 'text-foreground',
      info: 'text-info',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning'
    },
    size: {
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      base: 'text-base',
      lg: 'text-lg',
      md: 'text-base',
      sm: 'text-sm',
      xl: 'text-xl',
      xs: 'text-xs',
      '2xs': 'text-2xs',
      '3xs': 'text-3xs',
      '4xs': 'text-4xs'
    },
    weight: {
      bold: 'font-bold',
      medium: 'font-medium',
      normal: 'font-normal',
      semibold: 'font-semibold'
    }
  }
});

export type TextVariantProps = VariantProps<typeof textVariants>;
