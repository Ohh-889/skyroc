import { tv } from 'tailwind-variants';

export const accordionVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    content: [
      `overflow-hidden transition will-change-auto data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up`
    ],
    header: 'flex',
    item: 'border-b',
    root: '',
    trigger: [
      `flex-1 flex items-center justify-start font-medium transition-all duration-200 bg-transparent`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`,
      `hover:underline [&[data-state=open]>.trigger-icon]:rotate-180`
    ],
    triggerIcon: `trigger-icon ml-auto shrink-0 text-muted-foreground transition-transform duration-200`,
    triggerLeadingIcon: `shrink-0`
  },
  variants: {
    size: {
      '2xl': {
        content: 'data-[state=open]:pb-6',
        root: 'text-2xl',
        trigger: 'py-6 gap-6'
      },
      'lg': {
        content: 'data-[state=open]:pb-4.5',
        root: 'text-base',
        trigger: 'py-4.5 gap-4.5'
      },
      'md': {
        content: 'data-[state=open]:pb-4',
        root: 'text-sm',
        trigger: 'py-4 gap-4'
      },
      'sm': {
        content: 'data-[state=open]:pb-3.5',
        root: 'text-xs',
        trigger: 'py-3.5 gap-3.5'
      },
      'xl': {
        content: 'data-[state=open]:pb-5',
        root: 'text-lg',
        trigger: 'py-5 gap-5'
      },
      'xs': {
        content: 'data-[state=open]:pb-3',
        root: 'text-2xs',
        trigger: 'py-3 gap-3'
      }
    }
  }
});

export type AccordionSlots = keyof typeof accordionVariants.slots;
