import { tv } from 'tailwind-variants';

export const formVariants = tv({
  defaultVariants: {
    error: false,
    size: 'md'
  },
  slots: {
    description: `text-muted-foreground`,
    item: `form-item`,
    label: 'flex items-center data-[error=true]:text-destructive',
    message: `font-medium text-destructive`
  },
  variants: {
    error: {
      true: {
        message: `text-destructive`
      }
    },
    size: {
      '2xl': {
        item: 'text-xl space-y-3.5',
        label: 'gap-3.5'
      },
      'lg': {
        item: 'text-base space-y-2.5',
        label: 'gap-2.5'
      },
      'md': {
        item: 'text-sm space-y-2',
        label: 'gap-2'
      },
      'sm': {
        item: 'text-xs space-y-1.75',
        label: 'gap-1.75'
      },
      'xl': {
        item: 'text-lg space-y-3',
        label: 'gap-3'
      },
      'xs': {
        item: 'text-2xs space-y-1.5',
        label: 'gap-1.5'
      }
    }
  }
});

export type FormSlots = keyof typeof formVariants.slots;
