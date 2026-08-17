import { tv } from 'tailwind-variants';

/**
 * TreeSelect 样式变体。
 *
 * `selectedIcon` 输出的是 Uniwind 的 `accent-*` 工具类，供选中图标的 `colorClassName` 取色， 因此勾选颜色跟随主题 token；`sidebar`
 * 必须撑满行高，否则左栏背景只到最后一项就断了。
 */
export const treeSelectVariants = tv({
  slots: {
    content: 'flex-1 bg-background',
    contentItem: 'flex-row items-center justify-between px-4 py-3.5 active:opacity-80 will-change-pressable',
    contentItemText: 'text-sm text-foreground',
    root: 'flex-row overflow-hidden',
    selectedIcon: 'accent-primary',
    // Sidebar 根节点默认 self-start 且宽度由最长标题撑开，放进定高的行容器里高度只到内容高、
    // 宽度还会随分组数据跳动，这里固定宽度并拉满高度
    sidebar: 'w-24 self-stretch'
  },
  variants: {
    active: {
      true: {
        contentItemText: 'font-semibold text-primary'
      }
    },
    disabled: {
      true: {
        contentItem: 'opacity-50',
        contentItemText: 'text-muted-foreground'
      }
    }
  }
});
