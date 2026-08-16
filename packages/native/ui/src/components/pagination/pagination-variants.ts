import { tv } from 'tailwind-variants';

/**
 * 分页样式变体。
 *
 * 页码、省略号、上下页按钮同处一行，高度必须齐平：页码与上下页都是 `size="sm"` 的 Button（h-8）， 所以 `item` 只管最小宽度与内边距、把高度留给 Button，`ellipsis` 与 `simple`
 * 则自己补上同样的 h-8。
 *
 * 宽度用 `min-w-8` 而不是固定 `size-8`：总页数上三位后固定宽度会把数字挤掉，让格子按内容横向生长即可。
 *
 * 32dp 低于 44pt 的最小可点面积，但 Button 在 `sm` 下已按尺寸补了 hitSlop，这里不要再加 padding 撑高。
 */
export const paginationVariants = tv({
  slots: {
    content: 'flex-row items-center gap-1.5',
    desc: 'text-sm text-muted-foreground',
    ellipsis: 'h-8 min-w-8 items-center justify-center',
    item: 'min-w-8 px-2',
    itemText: 'text-sm',
    navButton: '',
    root: 'flex-row items-center justify-center',
    simple: 'h-8 min-w-8 items-center justify-center px-2'
  },
  variants: {
    active: {
      // 文字色由 Button 的 solid + primary 给出，这里只补字重，避免两处维护同一个颜色
      true: {
        itemText: 'font-semibold'
      }
    }
  }
});
