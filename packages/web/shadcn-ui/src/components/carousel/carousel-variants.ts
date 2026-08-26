import { tv } from 'tailwind-variants';

export const carouselVariants = tv({
  compoundVariants: [
    {
      class: {
        content: '-ml-3',
        item: 'pl-3',
        next: '-right-10',
        previous: '-left-10'
      },
      orientation: 'horizontal',
      size: 'xs'
    },
    {
      class: {
        content: '-ml-3.5',
        item: 'pl-3.5',
        next: '-right-11',
        previous: '-left-11'
      },
      orientation: 'horizontal',
      size: 'sm'
    },
    {
      class: {
        content: '-ml-4.5',
        item: 'pl-4.5',
        next: '-right-13',
        previous: '-left-13'
      },
      orientation: 'horizontal',
      size: 'lg'
    },
    {
      class: {
        content: '-ml-5',
        item: 'pl-5',
        next: '-right-14',
        previous: '-left-14'
      },
      orientation: 'horizontal',
      size: 'xl'
    },
    {
      class: {
        content: '-ml-6',
        item: 'pl-6',
        next: '-right-16',
        previous: '-left-16'
      },
      orientation: 'horizontal',
      size: '2xl'
    },
    {
      class: {
        content: '-mt-3',
        item: 'pt-3',
        next: '-bottom-10',
        previous: '-top-10'
      },
      orientation: 'vertical',
      size: 'xs'
    },
    {
      class: {
        content: '-mt-3.5',
        item: 'pt-3.5',
        next: '-bottom-11',
        previous: '-top-11'
      },
      orientation: 'vertical',
      size: 'sm'
    },
    {
      class: {
        content: '-mt-4.5',
        item: 'pt-4.5',
        next: '-bottom-13',
        previous: '-top-13'
      },
      orientation: 'vertical',
      size: 'lg'
    },
    {
      class: {
        content: '-mt-5',
        item: 'pt-5',
        next: '-bottom-14',
        previous: '-top-14'
      },
      orientation: 'vertical',
      size: 'xl'
    },
    {
      class: {
        content: '-mt-6',
        item: 'pt-6',
        next: '-bottom-16',
        previous: '-top-16'
      },
      orientation: 'vertical',
      size: '2xl'
    }
  ],
  defaultVariants: {
    orientation: 'horizontal'
  },
  slots: {
    content: 'flex',
    contentWrapper: 'overflow-hidden',
    item: 'min-w-0 shrink-0 grow-0 basis-full',
    next: 'touch-manipulation absolute',
    previous: 'touch-manipulation absolute',
    root: 'relative'
  },
  variants: {
    orientation: {
      horizontal: {
        content: '-ml-4',
        item: 'pl-4',
        next: '-right-12 top-1/2 -translate-y-1/2',
        previous: '-left-12 top-1/2 -translate-y-1/2'
      },
      vertical: {
        content: 'flex-col -mt-4',
        item: 'pt-4',
        next: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        previous: '-top-12 left-1/2 -translate-x-1/2 rotate-90'
      }
    },
    size: {
      '2xl': {
        root: 'text-xl'
      },
      'lg': {
        root: 'text-base'
      },
      'md': {
        root: 'text-sm'
      },
      'sm': {
        root: 'text-xs'
      },
      'xl': {
        root: 'text-lg'
      },
      'xs': {
        root: 'text-2xs'
      }
    }
  }
});

export type CarouselSlots = keyof typeof carouselVariants.slots;
