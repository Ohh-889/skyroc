import { tv } from 'tailwind-variants';

export const popoverVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    anchor: 'w-fit',
    arrow: 'w-1em h-0.5em fill-popover stroke-transparent',
    content: [
      `w-auto rounded-md border bg-popover  text-popover-foreground shadow-md outline-none z-50 will-change-transform`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`,
      `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
    ]
  },
  variants: {
    size: {
      '2xl': {
        arrow: 'text-lg',
        content: 'p-5.5 text-xl'
      },
      'lg': {
        arrow: 'text-sm',
        content: 'p-4.5 text-base'
      },
      'md': {
        arrow: 'text-xs',
        content: 'p-4 text-sm'
      },
      'sm': {
        arrow: 'text-2xs',
        content: 'p-3.5 text-xs'
      },
      'xl': {
        arrow: 'text-base',
        content: 'p-5 text-lg'
      },
      'xs': {
        arrow: 'text-3xs',
        content: 'p-3 text-2xs'
      }
    }
  }
});

export type PopoverSlots = keyof typeof popoverVariants.slots;
