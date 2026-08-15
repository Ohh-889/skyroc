import { tv } from 'tailwind-variants';

/** Divider 多 slot 样式变体 */
export const dividerVariants = tv({
  slots: {
    root: 'items-center',
    line: 'bg-border',
    text: 'px-3 text-sm text-muted-foreground'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'my-2 flex-row',
        line: 'h-px flex-1'
      },
      vertical: {
        root: 'mx-2 self-stretch',
        line: 'w-px flex-1'
      }
    },
    dashed: {
      true: {
        line: 'border-dashed'
      }
    },
    hairline: {
      true: {}
    },
    contentPosition: {
      left: {},
      center: {},
      right: {}
    }
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      dashed: true,
      class: {
        line: 'h-0 border-t border-border bg-transparent'
      }
    },
    {
      orientation: 'vertical',
      dashed: true,
      class: {
        line: 'w-0 border-l border-border bg-transparent'
      }
    }
  ],
  defaultVariants: {
    orientation: 'horizontal',
    dashed: false,
    hairline: true,
    contentPosition: 'center'
  }
});
