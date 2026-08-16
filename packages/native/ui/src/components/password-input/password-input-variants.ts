import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 密码输入框样式变体 */
const passwordInputVariants = tv({
  slots: {
    cell: 'items-center justify-center bg-background flex-1',
    dot: 'rounded-full bg-foreground',
    errorInfo: 'mt-3 text-center text-sm text-destructive',
    info: 'mt-3 text-center text-sm text-muted-foreground',
    root: '',
    security: 'overflow-hidden rounded-xl'
  },
  variants: {
    size: {
      lg: {
        cell: 'h-14',
        dot: 'h-3 w-3'
      },
      md: {
        cell: 'h-[50px]',
        dot: 'h-2.5 w-2.5'
      },
      sm: {
        cell: 'h-10',
        dot: 'h-2 w-2'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export { passwordInputVariants };
export type PasswordInputSlots = keyof typeof passwordInputVariants.slots;
export type PasswordInputVariantProps = VariantProps<typeof passwordInputVariants>;
