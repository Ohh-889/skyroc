import { tv } from 'tailwind-variants';

export const listVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    content: 'flex flex-col grow',
    description: '[&_p]:leading-relaxed text-muted-foreground',
    item: 'flex list-none',
    root: 'flex flex-col cursor-pointer',
    title: 'font-medium tracking-tight'
  },
  variants: {
    size: {
      '2xl': {
        content: 'gap-2',
        item: 'gap-7',
        root: 'gap-7 text-xl',
        title: 'text-2xl leading-[calc(var(--spacing)*6.25)]'
      },
      'lg': {
        content: 'gap-1.25',
        item: 'gap-5',
        root: 'gap-5 text-base',
        title: 'text-lg leading-[calc(var(--spacing)*5)]'
      },
      'md': {
        content: 'gap-1',
        item: 'gap-4',
        root: 'gap-4 text-sm',
        title: 'text-base leading-[calc(var(--spacing)*4.375)]'
      },
      'sm': {
        content: 'gap-1',
        item: 'gap-3',
        root: 'gap-3 text-xs',
        title: 'text-sm leading-[calc(var(--spacing)*3.75)]'
      },
      'xl': {
        content: 'gap-1.5',
        item: 'gap-6',
        root: 'gap-6 text-lg',
        title: 'text-xl leading-[calc(var(--spacing)*5.625)]'
      },
      'xs': {
        content: 'gap-0.75',
        item: 'gap-2',
        root: 'gap-2 text-2xs',
        title: 'text-xs leading-[calc(var(--spacing)*3.125)]'
      }
    }
  }
});

export type ListSlots = keyof typeof listVariants.slots;
