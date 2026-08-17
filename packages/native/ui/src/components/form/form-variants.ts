import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Form.Item 样式变体 */
export const formItemVariants = tv({
  defaultVariants: {
    error: false,
    size: 'md'
  },
  slots: {
    description: 'text-muted-foreground',
    label: 'text-foreground',
    root: '',
    message: 'font-medium text-destructive',
    required: 'mr-0.5 text-destructive'
  },
  variants: {
    error: {
      true: {
        label: 'text-destructive'
      }
    },
    size: {
      lg: {
        description: 'mt-1 text-sm',
        label: 'text-lg',
        message: 'mt-1 text-sm'
      },
      md: {
        description: 'mt-0.5 text-xs',
        label: 'text-md',
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

export type FormItemSlots = keyof typeof formItemVariants.slots;
export type FormItemVariantProps = VariantProps<typeof formItemVariants>;
