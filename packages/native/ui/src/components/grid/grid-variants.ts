import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const gridItemVariants = tv({
  slots: {
    content: 'items-center justify-center p-4',
    iconSlot: '',
    text: 'text-sm text-foreground'
  },
  variants: {
    center: {
      true: { content: 'items-center justify-center' },
      false: { content: 'items-start justify-start' }
    },
    direction: {
      horizontal: { content: 'flex-row', iconSlot: 'mr-2' },
      vertical: { content: 'flex-col', iconSlot: 'mb-2' }
    },
    reverse: {
      true: {},
      false: {}
    },
    square: {
      true: { content: 'flex-1' },
      false: {}
    }
  },
  compoundVariants: [
    { direction: 'vertical', reverse: true, class: { content: 'flex-col-reverse', iconSlot: 'mb-0 mt-2' } },
    { direction: 'horizontal', reverse: true, class: { content: 'flex-row-reverse', iconSlot: 'mr-0 ml-2' } }
  ],
  defaultVariants: {
    center: true,
    direction: 'vertical',
    reverse: false,
    square: false
  }
});

export type GridItemVariantProps = VariantProps<typeof gridItemVariants>;
