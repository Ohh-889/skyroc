import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Cell 列表项样式变体 */
export const cellVariants = tv({
  defaultVariants: {
    center: true,
    size: 'md'
  },
  slots: {
    content: 'flex-1',
    leading: 'mr-3 items-center justify-center',
    root: 'flex-row items-center bg-background overflow-hidden',
    subtitle: 'text-muted-foreground',
    title: 'text-foreground',
    trailing: 'ml-3 justify-center'
  },
  variants: {
    center: {
      true: {},
      false: { root: 'items-start' }
    },
    disabled: {
      true: { root: 'opacity-50' }
    },
    size: {
      lg: {
        root: 'min-h-14 px-4 py-3.5',
        subtitle: 'mt-1 text-sm',
        title: 'text-lg'
      },
      md: {
        root: 'min-h-12 px-4 py-3',
        subtitle: 'mt-0.5 text-xs',
        title: 'text-base'
      },
      sm: {
        root: 'min-h-10 px-3 py-2',
        subtitle: 'mt-0.5 text-2xs',
        title: 'text-sm'
      }
    }
  }
});

/** CellGroup 分组容器样式变体 */
export const cellGroupVariants = tv({
  defaultVariants: {
    inset: false
  },
  slots: {
    root: 'overflow-hidden rounded-xl',
    title: 'px-4 pb-2 pt-4 text-sm text-muted-foreground'
  },
  variants: {
    inset: {
      true: { root: 'mx-4 rounded-xl', title: 'px-0' }
    }
  }
});

export type CellVariantProps = VariantProps<typeof cellVariants>;
export type CellGroupVariantProps = VariantProps<typeof cellGroupVariants>;
