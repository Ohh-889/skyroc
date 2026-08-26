import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center font-medium transition-all-200 cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50'
  ],
  compoundVariants: [
    {
      color: 'destructive',
      variant: 'solid',
      class: `bg-destructive text-destructive-foreground hover:bg-destructive/80 active:bg-destructive-600`
    },
    {
      color: 'success',
      variant: 'solid',
      class: `bg-success text-success-foreground hover:bg-success/80 active:bg-success-600`
    },
    {
      color: 'warning',
      variant: 'solid',
      class: `bg-warning text-warning-foreground hover:bg-warning/80 active:bg-warning-600`
    },
    {
      color: 'info',
      variant: 'solid',
      class: `bg-info text-info-foreground hover:bg-info/80 active:bg-info-600`
    },
    {
      color: 'carbon',
      variant: 'solid',
      class: `bg-carbon text-carbon-foreground hover:bg-carbon/80 active:bg-carbon-600`
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: `bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary-foreground/20`
    },
    {
      color: 'accent',
      variant: 'solid',
      class: `bg-accent text-accent-foreground hover:bg-accent/80 active:bg-accent-foreground/20`
    },
    {
      color: 'primary',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-primary'
    },
    {
      color: 'destructive',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-destructive'
    },
    {
      color: 'success',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-success'
    },
    {
      color: 'warning',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-warning'
    },
    {
      color: 'info',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-info'
    },
    {
      color: 'carbon',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-carbon'
    },
    {
      color: 'secondary',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-secondary-foreground'
    },
    {
      color: 'accent',
      variant: ['outline', 'dashed', 'soft', 'ghost', 'link'],
      class: 'text-accent-foreground'
    },
    {
      color: 'primary',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-primary/10 active:bg-primary/20'
    },
    {
      color: 'destructive',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-destructive/10 active:bg-destructive/20'
    },
    {
      color: 'success',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-success/10 active:bg-success/20'
    },
    {
      color: 'warning',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-warning/10 active:bg-warning/20'
    },
    {
      color: 'info',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-info/10 active:bg-info/20'
    },
    {
      color: 'carbon',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-carbon/10 active:bg-carbon/20'
    },
    {
      color: 'secondary',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-secondary-foreground/10 active:bg-secondary-foreground/20'
    },
    {
      color: 'accent',
      variant: ['outline', 'dashed', 'ghost'],
      class: 'hover:bg-accent-foreground/10 active:bg-accent-foreground/20'
    },
    {
      color: 'primary',
      variant: 'plain',
      class: 'hover:border-primary hover:text-primary'
    },
    {
      color: 'destructive',
      variant: 'plain',
      class: 'hover:border-destructive hover:text-destructive'
    },
    {
      color: 'success',
      variant: 'plain',
      class: 'hover:border-success hover:text-success'
    },
    {
      color: 'warning',
      variant: 'plain',
      class: 'hover:border-warning hover:text-warning'
    },
    {
      color: 'info',
      variant: 'plain',
      class: 'hover:border-info hover:text-info'
    },
    {
      color: 'carbon',
      variant: 'plain',
      class: 'hover:border-carbon hover:text-carbon'
    },
    {
      color: 'secondary',
      variant: 'plain',
      class: 'hover:border-secondary-foreground hover:text-secondary-foreground'
    },
    {
      color: 'accent',
      variant: 'plain',
      class: 'hover:border-accent-foreground hover:text-accent-foreground'
    },
    {
      color: 'primary',
      variant: ['outline', 'dashed'],
      class: 'border-primary'
    },
    {
      color: 'destructive',
      variant: ['outline', 'dashed'],
      class: 'border-destructive'
    },
    {
      color: 'success',
      variant: ['outline', 'dashed'],
      class: 'border-success'
    },
    {
      color: 'warning',
      variant: ['outline', 'dashed'],
      class: 'border-warning'
    },
    {
      color: 'info',
      variant: ['outline', 'dashed'],
      class: 'border-info'
    },
    {
      color: 'carbon',
      variant: ['outline', 'dashed'],
      class: 'border-carbon'
    },
    {
      color: 'secondary',
      variant: ['outline', 'dashed'],
      class: 'border-secondary-foreground'
    },
    {
      color: 'accent',
      variant: ['outline', 'dashed'],
      class: 'border-accent-foreground'
    },
    {
      color: 'destructive',
      variant: 'soft',
      class: 'bg-destructive/10 hover:bg-destructive/10 active:bg-destructive/20'
    },
    {
      color: 'success',
      variant: 'soft',
      class: 'bg-success/10 hover:bg-success/10 active:bg-success/20'
    },
    {
      color: 'warning',
      variant: 'soft',
      class: 'bg-warning/10 hover:bg-warning/10 active:bg-warning/20'
    },
    {
      color: 'info',
      variant: 'soft',
      class: 'bg-info/10 hover:bg-info/10 active:bg-info/20'
    },
    {
      color: 'carbon',
      variant: 'soft',
      class: 'bg-carbon/10 hover:bg-carbon/10 active:bg-carbon/20'
    },
    {
      color: 'secondary',
      variant: 'soft',
      class: 'bg-secondary-foreground/10 hover:bg-secondary-foreground/10 active:bg-secondary-foreground/20'
    },
    {
      color: 'accent',
      variant: 'soft',
      class: 'bg-accent-foreground/10 hover:bg-accent-foreground/10 active:bg-accent-foreground/20'
    },
    {
      variant: ['ghost', 'link'],
      shadow: ['sm', 'md', 'lg'],
      class: 'shadow-none'
    },
    {
      variant: 'plain',
      shadow: 'sm',
      class: 'active:shadow-md'
    },
    {
      variant: 'plain',
      shadow: 'md',
      class: 'active:shadow-lg'
    },
    {
      variant: 'plain',
      shadow: 'lg',
      class: 'active:shadow-xl'
    },
    {
      variant: 'pure',
      shadow: 'sm',
      class: 'active:shadow-sm'
    },
    {
      variant: 'pure',
      shadow: 'md',
      class: 'active:shadow-md'
    },
    {
      variant: 'pure',
      shadow: 'lg',
      class: 'active:shadow-lg'
    },
    {
      size: 'xs',
      fitContent: true,
      class: 'p-0.75'
    },
    {
      size: 'sm',
      fitContent: true,
      class: 'p-0.875'
    },
    {
      size: 'md',
      fitContent: true,
      class: 'p-1'
    },
    {
      size: 'lg',
      fitContent: true,
      class: 'p-1.25'
    },
    {
      size: 'xl',
      fitContent: true,
      class: 'p-1.5'
    },
    {
      size: '2xl',
      fitContent: true,
      class: 'p-1.75'
    },
    {
      size: 'xs',
      fitContent: false,
      class: 'h-6 px-1.5'
    },
    {
      size: 'sm',
      fitContent: false,
      class: 'h-7 px-2'
    },
    {
      size: 'md',
      fitContent: false,
      class: 'h-8 px-4'
    },
    {
      size: 'lg',
      fitContent: false,
      class: 'h-9 px-6'
    },
    {
      size: 'xl',
      fitContent: false,
      class: 'h-10 px-8'
    },
    {
      size: '2xl',
      fitContent: false,
      class: 'h-12 px-10'
    },
    {
      size: 'xs',
      fitContent: false,
      shape: ['square', 'circle'],
      class: 'w-6'
    },
    {
      size: 'sm',
      fitContent: false,
      shape: ['square', 'circle'],
      class: 'w-7'
    },
    {
      size: 'lg',
      fitContent: false,
      shape: ['square', 'circle'],
      class: 'w-9'
    },
    {
      size: 'xl',
      fitContent: false,
      shape: ['square', 'circle'],
      class: 'w-10'
    },
    {
      size: '2xl',
      fitContent: false,
      shape: ['square', 'circle'],
      class: 'w-12'
    }
  ],
  variants: {
    color: {
      primary: `focus-visible:ring-primary`,
      destructive: `focus-visible:ring-destructive`,
      success: `focus-visible:ring-success`,
      warning: `focus-visible:ring-warning`,
      info: `focus-visible:ring-info`,
      carbon: `focus-visible:ring-carbon`,
      secondary: `focus-visible:ring-secondary-foreground/20`,
      accent: `focus-visible:ring-accent-foreground/20`
    },
    size: {
      'xs': 'gap-1 text-2xs',
      'sm': 'gap-2 text-xs',
      'md': 'gap-3 text-sm',
      'lg': 'gap-4 text-base',
      'xl': 'gap-5 text-lg',
      '2xl': 'gap-6 text-xl'
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    },
    fitContent: {
      true: 'w-fit h-fit',
      false: ''
    },
    variant: {
      solid: 'bg-primary text-primary-foreground hover:bg-primary/80 active:bg-primary-600',
      pure: 'border border-border bg-background text-accent-foreground hover:bg-accent/60 active:bg-accent',
      plain: 'border border-border bg-background text-foreground',
      outline: 'border bg-background',
      dashed: 'border border-dashed bg-background',
      soft: 'bg-primary/10 hover:bg-primary/10 active:bg-primary/20',
      ghost: 'bg-transparent',
      link: 'bg-transparent underline-offset-4 hover:underline'
    },
    shape: {
      auto: 'rounded-md',
      rounded: 'rounded-full',
      square: 'h-8 w-8 p-0 gap-0 rounded-md',
      circle: 'h-8 w-8 p-0 gap-0 rounded-full'
    }
  },

  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    shape: 'auto',
    shadow: 'sm',
    fitContent: false
  }
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonVariant = NonNullable<ButtonVariants['variant']>;

export type ButtonShape = NonNullable<ButtonVariants['shape']>;

export type ButtonShadow = NonNullable<ButtonVariants['shadow']>;
