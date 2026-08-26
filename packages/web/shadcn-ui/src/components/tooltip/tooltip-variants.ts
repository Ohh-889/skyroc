// @unocss-include
import { tv } from 'tailwind-variants';

export const tooltipVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    arrow: 'w-1em h-0.5em fill-carbon stroke-transparent',
    content: [
      'w-auto rounded-md border bg-carbon  text-carbon-foreground shadow-md outline-none z-50 will-change-transform',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
    ]
  },
  variants: {
    size: {
      '2xl': {
        arrow: 'text-lg',
        content: 'px-4.5 py-2.5 text-xl'
      },
      lg: {
        arrow: 'text-sm',
        content: 'px-3.5 py-1.75 text-base'
      },
      md: {
        arrow: 'text-xs',
        content: 'px-3 py-1.5 text-sm'
      },
      sm: {
        arrow: 'text-2xs',
        content: 'px-2.5 py-1.25 text-xs'
      },
      xl: {
        arrow: 'text-base',
        content: 'px-4 py-2 text-lg'
      },
      xs: {
        arrow: 'text-3xs',
        content: 'px-2 py-1 text-2xs'
      }
    }
  }
});

export type TooltipSlots = keyof typeof tooltipVariants.slots;
