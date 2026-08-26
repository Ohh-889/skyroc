import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const dividerVariants = tv({
  compoundVariants: [
    {
      class: {
        label: 'px-0.75 py-1.5'
      },
      orientation: 'vertical',
      size: 'xs'
    },
    {
      class: {
        label: 'px-1.5 py-0.75'
      },
      orientation: 'horizontal',
      size: 'xs'
    },
    {
      class: {
        label: 'px-0.875 py-1.75'
      },
      orientation: 'vertical',
      size: 'sm'
    },
    {
      class: {
        label: 'px-1.75 py-0.875'
      },
      orientation: 'horizontal',
      size: 'sm'
    },
    {
      class: {
        label: 'px-1 py-2'
      },
      orientation: 'vertical',
      size: 'md'
    },
    {
      class: {
        label: 'px-2 py-1'
      },
      orientation: 'horizontal',
      size: 'md'
    },
    {
      class: {
        label: 'px-1.125 py-2.25'
      },
      orientation: 'vertical',
      size: 'lg'
    },
    {
      class: {
        label: 'px-2.25 py-1.125'
      },
      orientation: 'horizontal',
      size: 'lg'
    },
    {
      class: {
        label: 'px-1.25 py-2.5'
      },
      orientation: 'vertical',
      size: 'xl'
    },
    {
      class: {
        label: 'px-2.5 py-1.25'
      },
      orientation: 'horizontal',
      size: 'xl'
    },
    {
      class: {
        label: 'px-1.5 py-3'
      },
      orientation: 'vertical',
      size: '2xl'
    },
    {
      class: {
        label: 'px-3 py-1.5'
      },
      orientation: 'horizontal',
      size: '2xl'
    }
  ],
  defaultVariants: {
    align: 'center',
    border: 'solid',
    orientation: 'horizontal',
    size: 'md'
  },
  slots: {
    label: `absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center text-muted-foreground bg-background`,
    root: `relative shrink-0 border-border`
  },
  variants: {
    align: {
      center: {
        label: 'left-1/2'
      },
      end: {
        label: 'left-15/16 sm:left-7/8 md:left-9/10 lg:left-11/12'
      },
      start: {
        label: 'left-1/16 sm:left-1/8 md:left-1/10 lg:left-1/12'
      }
    },
    border: {
      dashed: {
        root: 'border-dashed'
      },
      dotted: {
        root: 'border-dotted'
      },
      solid: {
        root: 'border-solid'
      }
    },
    orientation: {
      horizontal: {
        label: 'h-[1px]',
        root: 'w-full border-t'
      },
      vertical: {
        label: 'w-[1px]',
        root: 'h-full border-l'
      }
    },
    size: {
      '2xl': {
        label: 'text-2xl'
      },
      'lg': {
        label: 'text-base'
      },
      'md': {
        label: 'text-sm'
      },
      'sm': {
        label: 'text-xs'
      },
      'xl': {
        label: 'text-lg'
      },
      'xs': {
        label: 'text-2xs'
      }
    }
  }
});

type DividerVariants = VariantProps<typeof dividerVariants>;

export type DividerBorder = NonNullable<DividerVariants['border']>;

export type DividerSlots = keyof typeof dividerVariants.slots;
