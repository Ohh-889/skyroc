import { tv } from 'tailwind-variants';

/**
 * Sidebar 样式变体。
 *
 * `indicator` 的高度只写在这里，组件用 onLayout 实测后再做居中计算， 因此调用方通过 `classNames.indicator` 改高度也不会让指示器错位。
 */
export const sidebarVariants = tv({
  slots: {
    content: 'relative',
    indicator: 'h-4 w-1 rounded-full bg-primary',
    // items-center 让 Badge 包裹层收缩到文字宽度，角标才会贴着标题而不是飞到整项的右边缘
    item: 'items-center justify-center px-3 py-5 active:opacity-80 will-change-pressable',
    itemText: 'text-sm text-foreground',
    root: 'self-start bg-muted'
  },
  variants: {
    active: {
      true: {
        item: 'bg-background',
        itemText: 'font-semibold'
      }
    },
    disabled: {
      true: {
        item: 'opacity-50',
        itemText: 'text-muted-foreground'
      }
    }
  }
});
