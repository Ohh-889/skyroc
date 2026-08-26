import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const paginationVariants = tv({
  slots: {
    root: '',
    list: 'flex items-center',
    ellipsis: 'flex items-center justify-center text-muted-foreground',
    button: [
      'inline-flex items-center justify-center shrink-0 font-medium',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ],
    navigationButton: [
      'inline-flex items-center justify-center shrink-0 font-medium',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ]
  },
  variants: {
    size: {
      'xs': {
        list: 'gap-0.75 text-2xs',
        ellipsis: 'size-6',
        button: 'size-6',
        navigationButton: 'h-6 px-1 gap-[0.1875rem]'
      },
      'sm': {
        list: 'gap-1 text-xs',
        ellipsis: 'size-7',
        button: 'size-7',
        navigationButton: 'h-7 px-1.5 gap-1'
      },
      'md': {
        list: 'gap-1.25 text-sm',
        ellipsis: 'size-8',
        button: 'size-8',
        navigationButton: 'h-8 px-[0.46875rem] gap-1.5'
      },
      'lg': {
        list: 'gap-1.5 text-base',
        ellipsis: 'size-9',
        button: 'size-9',
        navigationButton: 'h-9 px-2 gap-2'
      },
      'xl': {
        list: 'gap-1.75 text-lg',
        ellipsis: 'size-10',
        button: 'size-10',
        navigationButton: 'h-10 px-[0.5625rem] gap-2.5'
      },
      '2xl': {
        list: 'gap-2 text-xl',
        ellipsis: 'size-12',
        button: 'size-12',
        navigationButton: 'h-12 px-[0.71875rem] gap-3'
      }
    },
    variant: {
      pure: {
        button: 'data-[selected]:border data-[selected]:border-border data-[selected]:bg-background data-[selected]:text-accent-foreground data-[selected]:hover:bg-accent/60 data-[selected]:active:bg-accent'
      },
      solid: {
        button: 'data-[selected]:border-transparent data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary/80 data-[selected]:hover:text-primary-foreground data-[selected]:active:bg-primary-600'
      },
      outline: {
        button: 'data-[selected]:border data-[selected]:border-primary data-[selected]:bg-background data-[selected]:text-primary data-[selected]:hover:bg-transparent'
      },
      soft: {
        button: 'data-[selected]:bg-primary/10 data-[selected]:hover:bg-primary/10 data-[selected]:active:bg-primary/20'
      }
    },
    shape: {
      rounded: {
        button: 'rounded-full',
        navigationButton: 'rounded-full'
      },
      square: {
        button: 'rounded-md',
        navigationButton: 'rounded-md'
      }
    },
    actionAsSelected: {
      true: {
        navigationButton: ''
      }
    }
  },
  compoundVariants: [
    {
      variant: 'pure',
      actionAsSelected: true,
      class: {
        navigationButton: 'data-[selected]:border data-[selected]:border-border data-[selected]:bg-background data-[selected]:text-accent-foreground data-[selected]:hover:bg-accent/60 data-[selected]:active:bg-accent'
      }
    },
    {
      variant: 'solid',
      actionAsSelected: true,
      class: {
        navigationButton: 'data-[selected]:border-transparent data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary/80 data-[selected]:hover:text-primary-foreground data-[selected]:active:bg-primary-600'
      }
    },
    {
      variant: 'outline',
      actionAsSelected: true,
      class: {
        navigationButton: 'data-[selected]:border data-[selected]:border-primary data-[selected]:bg-background data-[selected]:text-primary data-[selected]:hover:bg-transparent'
      }
    },
    {
      variant: 'soft',
      actionAsSelected: true,
      class: {
        navigationButton: 'data-[selected]:bg-primary/10 data-[selected]:hover:bg-primary/10 data-[selected]:active:bg-primary/20'
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'pure',
    shape: 'square',
    actionAsSelected: false
  }
});

type PaginationVariants = VariantProps<typeof paginationVariants>;

export type PaginationVariant = NonNullable<PaginationVariants['variant']>;

export type PaginationShape = NonNullable<PaginationVariants['shape']>;

export type PaginationSlots = keyof typeof paginationVariants.slots;
