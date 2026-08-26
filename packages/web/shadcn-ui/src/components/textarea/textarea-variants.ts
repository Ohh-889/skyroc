import { tv } from 'tailwind-variants';

export const textareaVariants = tv({
  defaultVariants: {
    resize: 'vertical',
    size: 'md'
  },
  slots: {
    content: [
      `flex w-full rounded-md border border-solid border-input bg-background`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary`,
      `disabled:cursor-not-allowed disabled:opacity-50`
    ],
    count: 'absolute z-2 leading-none text-muted-foreground',
    root: 'relative'
  },
  variants: {
    size: {
      '2xl': {
        content: 'min-h-12 px-4 py-2 text-xl',
        count: 'text-xl right-4 bottom-3.5'
      },
      'lg': {
        content: 'min-h-9 px-2.5 py-1 text-base',
        count: 'text-base right-3 bottom-2.5'
      },
      'md': {
        content: 'min-h-8 px-2 py-1 text-sm',
        count: 'text-sm right-2.5 bottom-2'
      },
      'sm': {
        content: 'min-h-7 px-1.75 py-1 text-xs',
        count: 'text-xs right-2 bottom-1.75'
      },
      'xl': {
        content: 'min-h-10 px-3 py-1 text-lg',
        count: 'text-lg right-3.5 bottom-3'
      },
      'xs': {
        content: 'min-h-6 px-1.5 py-1 text-2xs',
        count: 'text-2xs right-1.75 bottom-1.5'
      }
    }
  }
});

export type TextareaSlots = keyof typeof textareaVariants.slots;
