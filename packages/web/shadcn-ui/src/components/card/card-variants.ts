import { tv } from 'tailwind-variants';

export const cardVariants = tv({
  defaultVariants: {
    scrollable: true,
    split: false,
    size: 'md'
  },
  slots: {
    content: 'flex-grow overflow-auto',
    footer: 'flex items-center justify-between',
    header: 'flex items-center justify-between',
    root: 'flex flex-col items-stretch rounded-md border bg-card text-card-foreground shadow-sm',
    title: 'font-semibold tracking-tight',
    titleRoot: 'flex items-center'
  },
  variants: {
    size: {
      '2xl': {
        content: 'px-7 py-6',
        footer: 'px-7 py-6',
        header: 'px-7 py-6',
        root: 'text-lg',
        title: 'text-xl',
        titleRoot: 'gap-3.5'
      },
      'lg': {
        content: 'px-5 py-4',
        footer: 'px-5 py-5',
        header: 'px-5 py-4',
        root: 'text-base',
        title: 'text-lg',
        titleRoot: 'gap-2.5'
      },
      'md': {
        content: 'px-4 py-3',
        footer: 'px-4 py-3',
        header: 'px-4 py-3',
        root: 'text-sm',
        title: 'text-base',
        titleRoot: 'gap-2'
      },
      'sm': {
        content: 'px-3 py-2',
        footer: 'px-3 py-2',
        header: 'px-3 py-2',
        root: 'text-xs',
        title: 'text-sm',
        titleRoot: 'gap-1.75'
      },
      'xl': {
        content: 'px-6 py-5',
        footer: 'px-6 py-6',
        header: 'px-6 py-5',
        root: 'text-base',
        title: 'text-lg',
        titleRoot: 'gap-3'
      },
      'xs': {
        content: 'px-2 py-1.5',
        footer: 'px-2 py-1.5',
        header: 'px-2 py-1.5',
        root: 'text-2xs',
        title: 'text-xs',
        titleRoot: 'gap-1.5'
      }
    },
    scrollable: {
      true: {
        content: 'overflow-auto'
      }
    },
    split: {
      true: {
        root: 'divide-y divide-border'
      }
    }
  }
});

export type CardSlots = keyof typeof cardVariants.slots;
