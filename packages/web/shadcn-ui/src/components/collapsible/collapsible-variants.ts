import { tv } from 'tailwind-variants';

export const collapsibleVariants = tv({
  slots: {
    content: [
      'overflow-hidden transition will-change-auto',
      'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
    ],
    root: ''
  },
  variants: {
    size: {
      '2xl': {
        root: 'text-xl'
      },
      lg: {
        root: 'text-base'
      },
      md: {
        root: 'text-sm'
      },
      sm: {
        root: 'text-xs'
      },
      xl: {
        root: 'text-lg'
      },
      xs: {
        root: 'text-2xs'
      }
    }
  }
});

export type CollapsibleSlots = keyof typeof collapsibleVariants.slots;
