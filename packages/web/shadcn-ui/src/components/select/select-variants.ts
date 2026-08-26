import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const selectVariants = tv({
  defaultVariants: {
    position: 'popper',
    size: 'md'
  },
  slots: {
    content: [
      `relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`,
      `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
    ],
    group: '',
    groupLabel: `font-semibold`,
    item: [
      `relative flex items-center w-full rounded-sm outline-none cursor-pointer select-none`,
      `focus:bg-accent focus:text-accent-foreground `,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed`
    ],
    itemIndicator: `ml-auto shrink-0 text-muted-foreground`,
    itemText: '',
    scrollDownButton: `flex items-center justify-center cursor-default`,
    scrollUpButton: `flex items-center justify-center cursor-default`,
    selectedValue: '',
    separator: `-mx-1 my-1 h-px bg-muted`,
    trigger: [
      `flex items-center justify-between w-full rounded-md border border-input bg-background [&_span]:truncate`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`,
      `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary`,
      `disabled:cursor-not-allowed disabled:opacity-50 disabled:cursor-not-allowed`,
      `placeholder:text-muted-foreground data-[placeholder]:text-muted-foreground`
    ],
    triggerIcon: `shrink-0 text-muted-foreground opacity-70`,
    viewport: ''
  },
  variants: {
    position: {
      'item-aligned': '',
      'popper': {
        content: `data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1`,
        viewport: `h-[var(--radix-select-trigger-height)] w-full  min-w-[var(--radix-select-trigger-width)]`
      }
    },
    size: {
      '2xl': {
        content: 'max-h-115 text-xl',
        groupLabel: 'p-3',
        item: 'gap-3.5 px-3.5 py-2.5',
        scrollDownButton: 'py-1.75',
        scrollUpButton: 'py-1.75',
        separator: '-mx-1.75 my-0.875',
        trigger: 'h-12 px-4 text-xl',
        viewport: 'p-1.75'
      },
      'lg': {
        content: 'max-h-90 text-base',
        groupLabel: 'p-2',
        item: 'gap-2.5 px-2.5 py-1.5',
        scrollDownButton: 'py-1.25',
        scrollUpButton: 'py-1.25',
        separator: '-mx-1.25 my-0.625',
        trigger: 'h-9 px-3 text-base',
        viewport: 'p-1.25'
      },
      'md': {
        content: 'max-h-80 text-sm',
        groupLabel: 'p-1.75',
        item: 'gap-2 px-2 py-1.5',
        scrollDownButton: 'py-1',
        scrollUpButton: 'py-1',
        separator: '-mx-1 my-0.5',
        trigger: 'h-8 px-2.5 text-sm',
        viewport: 'p-1'
      },
      'sm': {
        content: 'max-h-75 text-xs',
        groupLabel: 'p-1.25',
        item: 'gap-1.5 px-1.5 py-1',
        scrollDownButton: 'py-0.875',
        scrollUpButton: 'py-0.875',
        separator: '-mx-0.875 my-0.4375',
        trigger: 'h-7 px-2 text-xs',
        viewport: 'p-0.875'
      },
      'xl': {
        content: 'max-h-100 text-lg',
        groupLabel: 'p-2.5',
        item: 'gap-3 px-3 py-2',
        scrollDownButton: 'py-1.5',
        scrollUpButton: 'py-1.5',
        separator: '-mx-1.5 my-0.75',
        trigger: 'h-10 px-3.5 text-lg',
        viewport: 'p-1.5'
      },
      'xs': {
        content: 'max-h-70 text-2xs',
        groupLabel: 'p-1',
        item: 'gap-1 px-1 py-1',
        scrollDownButton: 'py-0.75',
        scrollUpButton: 'py-0.75',
        separator: '-mx-0.75 my-0.375',
        trigger: 'h-6 px-1.5 text-2xs',
        viewport: 'p-0.75'
      }
    }
  }
});

type SelectVariants = VariantProps<typeof selectVariants>;

export type SelectPosition = NonNullable<SelectVariants['position']>;

export type SelectSlots = keyof typeof selectVariants.slots;
