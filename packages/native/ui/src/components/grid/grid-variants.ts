import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * 宫格样式变体。
 *
 * `item` 是格子外框，只负责列宽、间距与分隔线（尺寸相关的值来自运行时计算，落在 style 上）； `content` 是格子内的可视区域，负责内边距与图标文字的排布。
 *
 * 两层拆开是为了让 `square` 的 `aspect-square` 落在 `content` 上： gutter 是外框的内边距，正方形若画在外框上会把间距一起算进去，视觉上被压扁。
 */
export const gridVariants = tv({
  slots: {
    content: 'p-4',
    icon: '',
    item: 'overflow-hidden border-border',
    root: 'flex-row flex-wrap',
    text: 'text-sm text-foreground'
  },
  variants: {
    center: {
      true: { content: 'items-center justify-center' },
      false: { content: 'items-start justify-start' }
    },
    clickable: {
      true: { item: 'will-change-pressable active:opacity-70' }
    },
    direction: {
      horizontal: { content: 'flex-row', icon: 'mr-2' },
      vertical: { content: 'flex-col', icon: 'mb-2' }
    },
    disabled: {
      true: { item: 'opacity-40' }
    },
    reverse: {
      true: {}
    },
    square: {
      true: { content: 'aspect-square' }
    }
  },
  compoundVariants: [
    // reverse 只调换主轴方向，图标的外边距必须跟着换边，否则间距会留在文字的另一侧
    { direction: 'vertical', reverse: true, class: { content: 'flex-col-reverse', icon: 'mb-0 mt-2' } },
    { direction: 'horizontal', reverse: true, class: { content: 'flex-row-reverse', icon: 'mr-0 ml-2' } }
  ],
  defaultVariants: {
    center: true,
    direction: 'vertical',
    reverse: false,
    square: false
  }
});

export type GridVariantProps = VariantProps<typeof gridVariants>;
