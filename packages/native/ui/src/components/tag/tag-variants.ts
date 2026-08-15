import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export const tagVariants = tv({
  slots: {
    root: 'flex-row items-center',
    text: 'font-semibold',
    closeIcon: 'text-center'
  },
  variants: {
    variant: {
      solid: {},
      tonal: {},
      outline: { root: 'border' },
      ghost: {}
    },
    color: {
      primary: {},
      destructive: {},
      secondary: {},
      success: {},
      warning: {},
      info: {}
    },
    size: {
      sm: { root: 'h-5 gap-0.5 px-1.5', text: 'text-[10px]', closeIcon: 'ml-0.5 text-[10px]' },
      md: { root: 'h-6 gap-1 px-2', text: 'text-xs', closeIcon: 'ml-0.5 text-xs' },
      lg: { root: 'h-7 gap-1 px-2.5', text: 'text-sm', closeIcon: 'ml-1 text-sm' }
    },
    shape: {
      rounded: { root: 'rounded-md' },
      pill: { root: 'rounded-full' },
      mark: { root: 'rounded-r-full' }
    }
  },
  compoundVariants: [
    // === solid × color ===
    {
      variant: 'solid',
      color: 'primary',
      class: { root: 'bg-primary', text: 'text-primary-foreground', closeIcon: 'text-primary-foreground' }
    },
    {
      variant: 'solid',
      color: 'destructive',
      class: { root: 'bg-destructive', text: 'text-destructive-foreground', closeIcon: 'text-destructive-foreground' }
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: { root: 'bg-secondary', text: 'text-secondary-foreground', closeIcon: 'text-secondary-foreground' }
    },
    {
      variant: 'solid',
      color: 'success',
      class: { root: 'bg-success', text: 'text-success-foreground', closeIcon: 'text-success-foreground' }
    },
    {
      variant: 'solid',
      color: 'warning',
      class: { root: 'bg-warning', text: 'text-warning-foreground', closeIcon: 'text-warning-foreground' }
    },
    {
      variant: 'solid',
      color: 'info',
      class: { root: 'bg-info', text: 'text-info-foreground', closeIcon: 'text-info-foreground' }
    },

    // === tonal × color ===
    {
      variant: 'tonal',
      color: 'primary',
      class: { root: 'bg-primary/15', text: 'text-primary', closeIcon: 'text-primary' }
    },
    {
      variant: 'tonal',
      color: 'destructive',
      class: { root: 'bg-destructive/15', text: 'text-destructive', closeIcon: 'text-destructive' }
    },
    {
      variant: 'tonal',
      color: 'secondary',
      class: { root: 'bg-secondary/15', text: 'text-foreground', closeIcon: 'text-foreground' }
    },
    {
      variant: 'tonal',
      color: 'success',
      class: { root: 'bg-success/15', text: 'text-success', closeIcon: 'text-success' }
    },
    {
      variant: 'tonal',
      color: 'warning',
      class: { root: 'bg-warning/15', text: 'text-warning', closeIcon: 'text-warning' }
    },
    { variant: 'tonal', color: 'info', class: { root: 'bg-info/15', text: 'text-info', closeIcon: 'text-info' } },

    // === outline × color ===
    {
      variant: 'outline',
      color: 'primary',
      class: { root: 'border-primary', text: 'text-primary', closeIcon: 'text-primary' }
    },
    {
      variant: 'outline',
      color: 'destructive',
      class: { root: 'border-destructive', text: 'text-destructive', closeIcon: 'text-destructive' }
    },
    {
      variant: 'outline',
      color: 'secondary',
      class: { root: 'border-border', text: 'text-foreground', closeIcon: 'text-foreground' }
    },
    {
      variant: 'outline',
      color: 'success',
      class: { root: 'border-success', text: 'text-success', closeIcon: 'text-success' }
    },
    {
      variant: 'outline',
      color: 'warning',
      class: { root: 'border-warning', text: 'text-warning', closeIcon: 'text-warning' }
    },
    { variant: 'outline', color: 'info', class: { root: 'border-info', text: 'text-info', closeIcon: 'text-info' } },

    // === ghost × color ===
    { variant: 'ghost', color: 'primary', class: { text: 'text-primary', closeIcon: 'text-primary' } },
    { variant: 'ghost', color: 'destructive', class: { text: 'text-destructive', closeIcon: 'text-destructive' } },
    { variant: 'ghost', color: 'secondary', class: { text: 'text-foreground', closeIcon: 'text-foreground' } },
    { variant: 'ghost', color: 'success', class: { text: 'text-success', closeIcon: 'text-success' } },
    { variant: 'ghost', color: 'warning', class: { text: 'text-warning', closeIcon: 'text-warning' } },
    { variant: 'ghost', color: 'info', class: { text: 'text-info', closeIcon: 'text-info' } }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    shape: 'rounded'
  }
});

export type TagVariantProps = VariantProps<typeof tagVariants>;
