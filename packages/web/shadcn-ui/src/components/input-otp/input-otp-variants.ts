import { tv } from 'tailwind-variants';

export const inputOTPVariants = tv({
  compoundVariants: [
    {
      class: {
        group: 'gap-0.75'
      },
      separate: true,
      size: 'xs'
    },
    {
      class: {
        group: 'gap-1'
      },
      separate: true,
      size: 'sm'
    },
    {
      class: {
        group: 'gap-1.25'
      },
      separate: true,
      size: 'lg'
    },
    {
      class: {
        group: 'gap-1.5'
      },
      separate: true,
      size: 'xl'
    },
    {
      class: {
        group: 'gap-1.75'
      },
      separate: true,
      size: '2xl'
    }
  ],
  defaultVariants: {
    separate: false,
    size: 'md'
  },
  slots: {
    group: 'flex items-center disabled:opacity-50 has-[:disabled]:opacity-50',
    input: [
      `relative flex items-center justify-center text-center border-y border-r border-solid border-input bg-background transition-all duration-200`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary focus-visible:z-2`,
      `disabled:cursor-not-allowed disabled:opacity-50`
    ],
    root: `flex items-center disabled:cursor-not-allowed`,
    separator: `text-muted-foreground`
  },
  variants: {
    isActive: {
      true: {
        input: `z-10 ring-1 ring-ring`
      }
    },
    separate: {
      false: {
        input: `first:rounded-l-md first:border-l last:rounded-r-md`
      },
      true: {
        group: `gap-1`,
        input: `rounded-md border`
      }
    },
    size: {
      '2xl': {
        input: `h-12 w-12 text-xl`,
        separator: `text-xl`
      },
      'lg': {
        input: `h-9 w-9 text-base`,
        separator: `text-base`
      },
      'md': {
        input: `h-8 w-8 text-sm`,
        separator: `text-sm`
      },
      'sm': {
        input: `h-7 w-7 text-xs`,
        separator: `text-xs`
      },
      'xl': {
        input: `h-10 w-10 text-lg`,
        separator: `text-lg`
      },
      'xs': {
        input: `h-6 w-6 text-2xs`,
        separator: `text-2xs`
      }
    }
  }
});

export type InputOTPSlots = keyof typeof inputOTPVariants.slots;
