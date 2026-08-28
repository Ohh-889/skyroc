import { tv } from 'tailwind-variants';

export const menubarVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    root: `flex items-center rounded-md border bg-background shadow-sm`
  },
  variants: {
    size: {
      '2xl': {
        root: 'gap-2.5 p-1.25'
      },
      lg: {
        root: 'gap-1.75 p-0.875'
      },
      md: {
        root: 'gap-1.5 p-0.75'
      },
      sm: {
        root: 'gap-1.25 p-0.625 text-xs'
      },
      xl: {
        root: 'gap-2 p-1'
      },
      xs: {
        root: 'gap-1 p-0.5 text-2xs'
      }
    }
  }
});

export type MenubarSlots = keyof typeof menubarVariants.slots;
