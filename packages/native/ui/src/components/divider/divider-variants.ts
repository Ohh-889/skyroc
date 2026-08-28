import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Divider 分割线样式变体。
 *
 * 线条粗细这里只给 1dp 的类名兜底：真正的 hairline 是 0.5/0.33dp，Tailwind 没有能表达的工具类， 由组件用 `StyleSheet.hairlineWidth` 注入 style 完成。
 *
 * `border` 为 dashed/dotted 时线条改用边框绘制，所以要按方向把 `h-px bg-border` 换成 `h-0 border-t`。
 *
 * `lineLeading` / `lineTrailing` 只在有内容时挂到两侧线条上，`align` 为 start/end 时把短的那侧压到 10%， 需要别的比例时由使用方通过 `classNames.lineLeading`
 * 覆盖。
 *
 * 竖向分割线用 `self-stretch` 跟随父级：父容器必须是横向布局且有确定高度，否则线条高度为 0（看不见）。
 */
export const dividerVariants = tv({
  compoundVariants: [
    // 虚线/点线没法用背景色画，改成单边边框，并把实线用的高度/宽度清零
    {
      border: ['dashed', 'dotted'],
      class: {
        line: 'h-0 border-t'
      },
      orientation: 'horizontal'
    },
    {
      border: ['dashed', 'dotted'],
      class: {
        line: 'w-0 border-l'
      },
      orientation: 'vertical'
    },
    // 内容偏向一侧时，压缩该侧线条
    {
      align: 'start',
      class: {
        lineLeading: 'max-w-[10%]'
      },
      orientation: 'horizontal'
    },
    {
      align: 'end',
      class: {
        lineTrailing: 'max-w-[10%]'
      },
      orientation: 'horizontal'
    },
    {
      align: 'start',
      class: {
        lineLeading: 'max-h-[10%]'
      },
      orientation: 'vertical'
    },
    {
      align: 'end',
      class: {
        lineTrailing: 'max-h-[10%]'
      },
      orientation: 'vertical'
    }
  ],
  defaultVariants: {
    align: 'center',
    border: 'solid',
    orientation: 'horizontal'
  },
  slots: {
    line: 'bg-border',
    lineLeading: '',
    lineTrailing: '',
    root: 'items-center',
    text: 'text-sm text-muted-foreground'
  },
  variants: {
    align: {
      center: {},
      end: {},
      start: {}
    },
    border: {
      dashed: {
        line: 'border-dashed border-border bg-transparent'
      },
      dotted: {
        line: 'border-dotted border-border bg-transparent'
      },
      solid: {}
    },
    orientation: {
      horizontal: {
        line: 'h-px flex-1',
        root: 'my-2 flex-row',
        text: 'px-3'
      },
      vertical: {
        line: 'w-px flex-1',
        root: 'mx-2 self-stretch',
        text: 'py-3'
      }
    }
  }
});

export type DividerVariantProps = VariantProps<typeof dividerVariants>;
