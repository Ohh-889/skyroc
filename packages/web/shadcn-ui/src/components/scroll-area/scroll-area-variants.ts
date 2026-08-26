import { tv } from 'tailwind-variants';

export const scrollAreaVariants = tv({
  compoundVariants: [
    {
      class: {
        scrollbar: 'h-1.5'
      },
      orientation: 'horizontal',
      size: 'xs'
    },
    {
      class: {
        scrollbar: 'w-1.5'
      },
      orientation: 'vertical',
      size: 'xs'
    },
    {
      class: {
        scrollbar: 'h-2'
      },
      orientation: 'horizontal',
      size: 'sm'
    },
    {
      class: {
        scrollbar: 'w-2'
      },
      orientation: 'vertical',
      size: 'sm'
    },
    {
      class: {
        scrollbar: 'h-2.5'
      },
      orientation: 'horizontal',
      size: 'md'
    },
    {
      class: {
        scrollbar: 'w-2.5'
      },
      orientation: 'vertical',
      size: 'md'
    },
    {
      class: {
        scrollbar: 'h-3'
      },
      orientation: 'horizontal',
      size: 'lg'
    },
    {
      class: {
        scrollbar: 'w-3'
      },
      orientation: 'vertical',
      size: 'lg'
    },
    {
      class: {
        scrollbar: 'h-3.5'
      },
      orientation: 'horizontal',
      size: 'xl'
    },
    {
      class: {
        scrollbar: 'w-3.5'
      },
      orientation: 'vertical',
      size: 'xl'
    },
    {
      class: {
        scrollbar: 'h-4'
      },
      orientation: 'horizontal',
      size: '2xl'
    },
    {
      class: {
        scrollbar: 'w-4'
      },
      orientation: 'vertical',
      size: '2xl'
    }
  ],
  defaultVariants: {
    orientation: 'vertical',
    size: 'md'
  },
  slots: {
    corner: '',
    root: 'relative overflow-hidden',
    scrollbar: 'flex touch-none select-none transition-colors-200',
    thumb: 'relative flex-1 rounded-full bg-border',
    viewport: 'size-full rounded-inherit'
  },
  variants: {
    orientation: {
      horizontal: {
        scrollbar: 'flex-col p-px border-t border-t-transparent'
      },
      vertical: {
        scrollbar: 'h-full p-px border-l border-l-transparent'
      }
    },
    size: {
      '2xl': {},
      lg: {},
      md: {},
      sm: {},
      xl: {},
      xs: {}
    }
  }
});

export type ScrollAreaSlots = keyof typeof scrollAreaVariants.slots;
