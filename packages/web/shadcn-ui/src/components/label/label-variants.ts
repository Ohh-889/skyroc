import { tv } from 'tailwind-variants';

export const labelVariants = tv({
  base: 'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  defaultVariants: {
    size: 'md'
  },
  variants: {
    size: {
      '2xl': 'text-xl',
      'lg': 'text-base',
      'md': 'text-sm',
      'sm': 'text-xs',
      'xl': 'text-lg',
      'xs': 'text-2xs'
    }
  }
});
