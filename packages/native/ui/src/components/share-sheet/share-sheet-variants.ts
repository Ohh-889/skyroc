import { tv } from 'tailwind-variants';

/**
 * ShareSheet 多 slot 样式变体。
 *
 * `root` 是交给 Sheet 的内容容器：Sheet 不再代为包裹内容，底部安全区也一并归内容容器， 所以 `pb-safe-or-2` 写在这里而不是面板上。
 *
 * `options` 落在横向 ScrollView 的 contentContainer 上而不是 ScrollView 本身： 左右留白写在容器上会被算进滚动视口，首尾两项就贴边了。
 */
const shareSheetVariants = tv({
  slots: {
    root: 'pb-safe-or-2',
    cancel: 'items-center justify-center bg-background px-4 py-3.5 will-change-pressable active:opacity-80',
    cancelGap: 'h-2 bg-muted',
    cancelName: 'text-base text-foreground',
    option: 'w-20 items-center will-change-pressable active:opacity-80',
    optionDescription: 'mt-0.5 text-center text-xs text-muted-foreground',
    optionIcon: 'size-12 items-center justify-center rounded-full bg-muted',
    optionName: 'mt-2 text-center text-xs text-foreground',
    options: 'flex-row px-2 py-4',
    row: ''
  }
});

export { shareSheetVariants };
