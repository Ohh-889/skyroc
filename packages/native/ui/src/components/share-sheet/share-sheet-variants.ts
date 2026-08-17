import { tv } from 'tailwind-variants';

/** ShareSheet 多 slot 样式变体 */
const shareSheetVariants = tv({
  slots: {
    cancel: 'items-center justify-center bg-background px-4 py-3.5 active:opacity-80 will-change-pressable',
    cancelGap: 'h-2 bg-muted',
    option: 'w-20 items-center active:opacity-80 will-change-pressable',
    optionDescription: 'mt-0.5 text-xs text-muted-foreground',
    optionIcon: 'size-12 items-center justify-center rounded-full bg-muted',
    optionName: 'mt-2 text-center text-xs text-foreground',
    root: ''
  }
});

export { shareSheetVariants };
