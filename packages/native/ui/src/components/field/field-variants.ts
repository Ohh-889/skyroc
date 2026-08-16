import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** FieldItem 样式变体 */
export const fieldItemVariants = tv({
  defaultVariants: {
    size: 'lg'
  },
  slots: {
    description: 'text-muted-foreground',
    label: 'font-medium text-primary',
    message: 'text-destructive',
    required: 'mr-0.5 text-destructive',
    root: ''
  },
  variants: {
    size: {
      lg: {
        description: 'mt-1 text-sm',
        label: 'text-lg',
        message: 'mt-1 text-sm'
      },
      md: {
        description: 'mt-0.5 text-xs',
        label: 'text-base',
        message: 'mt-0.5 text-xs'
      },
      sm: {
        description: 'mt-0.5 text-2xs',
        label: 'text-sm',
        message: 'mt-0.5 text-2xs'
      }
    }
  }
});

export type FieldItemSlots = keyof typeof fieldItemVariants.slots;
export type FieldItemVariantProps = VariantProps<typeof fieldItemVariants>;
