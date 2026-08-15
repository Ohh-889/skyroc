import { tv } from 'tailwind-variants';

export const collapseVariants = tv({
  slots: {
    root: '',
  },
  variants: {
    border: {
      true: {
        root: 'border-b border-t border-border',
      },
    },
  },
});

export const collapseItemVariants = tv({
  defaultVariants: {
    size: 'md',
  },
  slots: {
    content: 'bg-background px-4 py-3 text-sm text-muted-foreground',
    root: '',
    wrapper: '',
  },
  variants: {
    border: {
      true: {
        root: 'border-t border-border',
      },
    },
    disabled: {
      true: {
        root: 'opacity-50',
      },
    },
    size: {
      lg: {
        content: 'px-4 py-3 text-base',
      },
      md: {
        content: 'px-4 py-3 text-sm',
      },
    },
  },
});
