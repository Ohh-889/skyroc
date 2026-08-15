import { tv } from 'tailwind-variants';

/** Dialog 多 slot 样式变体 */
export const dialogVariants = tv({
  slots: {
    root: 'overflow-hidden rounded-2xl bg-background',
    header: 'px-6 pt-6',
    body: 'px-6 py-4',
    footer: 'flex-row',
    title: 'text-center text-lg font-semibold text-foreground',
    message: 'text-md text-muted-foreground',
    confirmButton: 'flex-1 items-center justify-center py-2',
    confirmButtonText: 'text-sm font-medium text-primary',
    cancelButton: 'flex-1 items-center justify-center py-2',
    cancelButtonText: 'text-sm text-muted-foreground'
  },
  variants: {
    messageAlign: {
      center: { message: 'text-center' },
      left: { message: 'text-left' },
      right: { message: 'text-right' }
    },
    hasTitle: {
      true: { body: 'pb-6 pt-2' },
      false: { body: 'py-6' }
    },
    theme: {
      default: {},
      'round-button': {
        footer: 'gap-2 px-6 pb-4 pt-2'
      }
    }
  },
  defaultVariants: {
    messageAlign: 'center',
    hasTitle: false,
    theme: 'default'
  }
});
