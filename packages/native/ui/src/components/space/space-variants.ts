import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Space 样式变体 */
export const spaceVariants = tv({
  base: 'flex',
  defaultVariants: {
    direction: 'horizontal',
    size: 'md'
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start'
    },
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    },
    fill: {
      true: 'w-full'
    },
    size: {
      lg: 'gap-4',
      md: 'gap-3',
      sm: 'gap-2',
      xl: 'gap-6',
      xs: 'gap-1'
    },
    wrap: {
      true: 'flex-wrap'
    }
  }
});

export type SpaceVariantProps = VariantProps<typeof spaceVariants>;
