import { tv } from 'tailwind-variants';

/** NavBar 多 slot 样式变体 */
export const navBarVariants = tv({
  slots: {
    root: 'relative h-11 flex-row items-center justify-between bg-background px-4',
    title: 'absolute inset-0 items-center justify-center',
    left: 'z-10 flex-row items-center gap-1',
    right: 'z-10 flex-row items-center gap-1'
  },
  variants: {
    border: {
      true: {
        root: 'border-b border-border'
      }
    },
    leftDisabled: {
      true: {
        left: 'opacity-50'
      }
    },
    rightDisabled: {
      true: {
        right: 'opacity-50'
      }
    }
  },
  defaultVariants: {
    border: true,
    leftDisabled: false,
    rightDisabled: false
  }
});
