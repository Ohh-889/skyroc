import { tv } from 'tailwind-variants';

export const sidebarVariants = tv({
  slots: {
    indicator: 'h-4 w-1 rounded-full bg-primary',
    item: 'justify-center px-3 py-5 active:opacity-80 will-change-pressable',
    itemText: 'text-sm text-foreground',
    root: 'relative self-start bg-muted'
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
