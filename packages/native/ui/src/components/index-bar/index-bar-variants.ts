import { tv } from 'tailwind-variants';

export const indexBarVariants = tv({
  slots: {
    anchor: 'bg-muted px-4 py-1.5',
    anchorText: 'text-sm font-semibold text-foreground',
    item: 'px-4 py-3 justify-start',
    itemText: 'text-sm text-foreground',
    root: 'relative flex-1',
    separator: 'mx-4 my-0',
    sidebar: 'absolute bottom-0 right-2 top-0 z-10 items-center justify-center',
    sidebarItem: 'h-auto min-h-0 px-1 py-0.5',
    sidebarItemText: 'text-[10px] font-normal'
  },
  variants: {
    active: {
      true: {
        sidebarItemText: 'font-bold'
      }
    }
  }
});
