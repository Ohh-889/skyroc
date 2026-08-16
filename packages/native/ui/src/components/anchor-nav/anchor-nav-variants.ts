import { tv } from 'tailwind-variants';

export const anchorNavVariants = tv({
  slots: {
    content: 'flex-1 bg-background',
    item: 'flex-row items-center gap-3 px-3 py-2 active:opacity-80',
    itemText: 'flex-1 text-sm text-foreground',
    root: 'flex-row',
    sectionHeader: 'bg-muted/50 px-3 py-1.5',
    sectionHeaderText: 'text-xs font-semibold text-muted-foreground',
    separator: 'mx-3 my-0'
  }
});
