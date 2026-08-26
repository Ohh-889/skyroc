import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const toggleVariants = tv({
  defaultVariants: {
    size: 'md',
    variant: 'ghost'
  },
  slots: {
    groupRoot: `flex justify-center items-center`,
    toggle: [
      `inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`,
      `hover:bg-muted hover:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50`,
      `data-[state=on]:bg-accent data-[state=on]:hover:bg-accent data-[state=on]:text-accent-foreground`
    ]
  },
  variants: {
    size: {
      '2xl': {
        groupRoot: `gap-3`,
        toggle: `h-12 px-10 text-xl`
      },
      'lg': {
        groupRoot: `gap-2.5`,
        toggle: `h-9 px-6 text-base`
      },
      'md': {
        groupRoot: `gap-2`,
        toggle: `h-8 px-4 text-sm`
      },
      'sm': {
        groupRoot: `gap-1.75`,
        toggle: `h-7 px-2 text-xs`
      },
      'xl': {
        groupRoot: `gap-3`,
        toggle: `h-10 px-8 text-lg`
      },
      'xs': {
        groupRoot: `gap-1.5`,
        toggle: `h-6 px-1.5 text-2xs`
      }
    },
    variant: {
      ghost: {
        toggle: `bg-transparent`
      },
      outline: {
        toggle: `border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground`
      }
    }
  }
});

type ToggleVariants = VariantProps<typeof toggleVariants>;

export type ToggleVariant = NonNullable<ToggleVariants['variant']>;

export type ToggleSlots = keyof typeof toggleVariants.slots;
