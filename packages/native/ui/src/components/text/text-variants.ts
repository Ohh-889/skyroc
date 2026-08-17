import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Text 的兜底样式，优先级最低。
 *
 * 刻意与 textVariants 分离：默认值若放在 defaultVariants 里，会让 textVariants() 在未传任何 props 时也吐出基础类，从而覆盖 TextClassContext 继承来的父级样式。
 */
export const textBaseClass = 'text-foreground text-base font-normal will-change-variable';

export const textVariants = tv({
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
