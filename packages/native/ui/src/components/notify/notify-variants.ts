import { tv } from 'tailwind-variants';

/** Notify 样式变体 */
const notifyVariants = tv({
  slots: {
    content: 'items-center justify-center px-4 py-2',
    message: 'text-center text-sm font-medium text-white',
    root: ''
  },
  variants: {
    type: {
      danger: { root: 'bg-destructive' },
      primary: { root: 'bg-primary' },
      success: { root: 'bg-success' },
      warning: { root: 'bg-warning' }
    }
  },
  defaultVariants: {
    type: 'danger'
  }
});

export { notifyVariants };
