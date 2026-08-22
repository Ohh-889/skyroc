import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * List 样式变体。
 *
 * `empty` 为 true 时给内容容器加 `grow`，让占位区能在整屏高度里居中： FlatList 的 contentContainer 默认按内容高度收缩，不撑开的话空态会贴在顶部。
 *
 * 分割线复用 Divider，但它自带 `my-2` 的上下外边距，作为列表分割线要清掉。
 */
export const listVariants = tv({
  defaultVariants: {
    empty: false
  },
  slots: {
    content: 'px-4 pb-8',
    footer: 'w-full flex-row items-center justify-center gap-2 py-4',
    placeholder: 'flex-1 items-center justify-center gap-3 px-8 py-16',
    root: 'flex-1',
    separator: 'my-0'
  },
  variants: {
    empty: {
      false: {},
      true: {
        content: 'grow'
      }
    }
  }
});

export type ListVariantProps = VariantProps<typeof listVariants>;
