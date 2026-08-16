import { tv } from 'tailwind-variants';

export const dropdownMenuVariants = tv({
  slots: {
    bar: 'flex-row items-center bg-background',
    content: 'bg-background overflow-hidden',
    option: 'h-12 flex-row items-center justify-between px-4 active:opacity-80',
    optionText: 'text-sm text-foreground',
    root: 'relative',
    title: 'flex-1 flex-row items-center justify-center py-3',
    titleText: 'text-sm text-muted-foreground'
  },
  variants: {
    active: {
      true: {
        optionText: 'font-semibold text-[#000]',
        titleText: 'text-[#000] font-semibold'
      }
    },
    disabled: {
      true: {
        option: 'opacity-50',
        title: 'opacity-50'
      }
    },
    opened: {
      true: {
        root: 'z-[100]'
      }
    }
  }
});
