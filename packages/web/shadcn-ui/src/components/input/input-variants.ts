import { tv } from 'tailwind-variants';

export const inputVariants = tv({
  slots: {
    root: [
      `group flex items-center w-full rounded-md border border-solid border-input bg-background`,
      `focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background focus-within:ring-primary`
    ],
    control: [
      'grow bg-transparent outline-none',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'file:border-0 file:bg-transparent file:font-medium'
    ],
    clearable: 'hidden group-hover:block size-1em cursor-pointer opacity-50 hover:opacity-100',
    visible: 'cursor-pointer'
  },
  variants: {
    size: {
      'xs': {
        root: 'h-6 px-1.5 text-2xs gap-1',
        control: 'file:py-1.25'
      },
      'sm': {
        root: 'h-7 px-2 text-xs gap-1.5',
        control: 'file:py-1.25'
      },
      'md': {
        root: 'h-8 px-2.5 text-sm gap-2',
        control: 'file:py-1.25'
      },
      'lg': {
        root: 'h-9 px-3 text-base gap-2.5',
        control: 'file:py-1.25'
      },
      'xl': {
        root: 'h-10 px-3.5 text-lg gap-3',
        control: 'file:py-1.25'
      },
      '2xl': {
        root: 'h-12 px-4 text-xl gap-3.5',
        control: 'file:py-2'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export type InputSlots = keyof ReturnType<typeof inputVariants>;
