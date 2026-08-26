import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const kbdVariants = tv({
  base: `inline-flex items-center justify-center w-fit text-center font-medium border border-border shadow-[0_2px_0_0] rounded-sm font-[inherit]`,
  variants: {
    variant: {
      solid: 'border-muted-foreground bg-muted-foreground text-muted shadow-muted-foreground/50',
      outline: 'border-border bg-background text-muted-foreground shadow-border',
      ghost: 'border-border bg-muted text-muted-foreground shadow-border/50'
    },
    size: {
      'xs': 'h-4 min-w-4 px-0.5 text-3xs data-[group]:tracking-[0.125rem]',
      'sm': 'h-4.5 min-w-4.5 px-0.625 text-2xs data-[group]:tracking-[0.15625rem]',
      'md': 'h-5 min-w-5 px-0.75 text-xs data-[group]:tracking-[0.1875rem]',
      'lg': 'h-6 min-w-6 px-1 text-sm data-[group]:tracking-[0.25rem]',
      'xl': 'h-7 min-w-7 px-1.25 text-base data-[group]:tracking-[0.3125rem]',
      '2xl': 'h-8 min-w-8 px-1.5 text-xl data-[group]:tracking-[0.375rem]'
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline'
  }
});

type KbdVariantsType = VariantProps<typeof kbdVariants>;

export type KbdVariant = NonNullable<KbdVariantsType['variant']>;
export type KbdSize = NonNullable<KbdVariantsType['size']>;
