import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const tagVariants = tv({
  base: 'inline-flex items-center border font-semibold',
  compoundVariants: [
    {
      class: `bg-primary text-primary-foreground`,
      color: 'primary',
      variant: 'solid'
    },
    {
      class: `bg-destructive text-destructive-foreground`,
      color: 'destructive',
      variant: 'solid'
    },
    {
      class: `bg-success text-success-foreground`,
      color: 'success',
      variant: 'solid'
    },
    {
      class: `bg-warning text-warning-foreground`,
      color: 'warning',
      variant: 'solid'
    },
    {
      class: `bg-info text-info-foreground`,
      color: 'info',
      variant: 'solid'
    },
    {
      class: `bg-carbon text-carbon-foreground`,
      color: 'carbon',
      variant: 'solid'
    },
    {
      class: `bg-secondary text-secondary-foreground`,
      color: 'secondary',
      variant: 'solid'
    },
    {
      class: `bg-accent text-accent-foreground`,
      color: 'accent',
      variant: 'solid'
    },
    {
      class: 'bg-primary/10',
      color: 'primary',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-destructive/10',
      color: 'destructive',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-success/10',
      color: 'success',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-warning/10',
      color: 'warning',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-info/10',
      color: 'info',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-carbon/10',
      color: 'carbon',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-secondary-foreground/5',
      color: 'secondary',
      variant: ['soft', 'ghost']
    },
    {
      class: 'bg-accent-foreground/5',
      color: 'accent',
      variant: ['soft', 'ghost']
    }
  ],
  defaultVariants: {
    color: 'primary',
    shape: 'auto',
    size: 'md',
    variant: 'solid'
  },
  variants: {
    color: {
      accent: 'border-accent-foreground/50 text-accent-foreground',
      carbon: 'border-carbon text-carbon',
      destructive: 'border-destructive text-destructive',
      info: 'border-info text-info',
      primary: 'border-primary text-primary',
      secondary: 'border-secondary-foreground/50 text-secondary-foreground',
      success: 'border-success text-success',
      warning: 'border-warning text-warning'
    },
    shape: {
      auto: 'rounded-md',
      rounded: 'rounded-full'
    },
    size: {
      '2xl': 'gap-2 h-7 px-4 text-base',
      'lg': 'gap-1.25 h-5 px-2.5 text-xs',
      'md': 'gap-1 h-4.5 px-2 text-2xs',
      'sm': 'gap-0.75 h-4 px-1.5 text-3xs',
      'xl': 'gap-1.5 h-6 px-3 text-sm',
      'xs': 'gap-0.5 h-3.5 px-1 text-4xs'
    },
    variant: {
      ghost: '',
      outline: 'bg-background',
      pure: 'bg-background text-foreground border-border',
      raw: 'bg-transparent border-0',
      soft: 'border-0',
      solid: ''
    }
  }
});

type TagVariants = VariantProps<typeof tagVariants>;

export type TagVariant = NonNullable<TagVariants['variant']>;

export type TagShape = NonNullable<TagVariants['shape']>;
