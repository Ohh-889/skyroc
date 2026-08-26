import { tv } from 'tailwind-variants';

export const progressVariants = tv({
  defaultVariants: {
    color: 'primary',
    size: 'md'
  },
  slots: {
    indicator: 'flex-1 size-full transition-all duration-200',
    root: 'relative w-full overflow-hidden rounded-full'
  },
  variants: {
    color: {
      accent: {
        indicator: 'bg-accent-foreground',
        root: 'bg-accent-foreground/20'
      },
      carbon: {
        indicator: 'bg-carbon',
        root: 'bg-carbon/20'
      },
      destructive: {
        indicator: 'bg-destructive',
        root: 'bg-destructive/20'
      },
      info: {
        indicator: 'bg-info',
        root: 'bg-info/20'
      },
      primary: {
        indicator: 'bg-primary',
        root: 'bg-primary/20'
      },
      secondary: {
        indicator: 'bg-secondary-foreground',
        root: 'bg-secondary-foreground/20'
      },
      success: {
        indicator: 'bg-success',
        root: 'bg-success/20'
      },
      warning: {
        indicator: 'bg-warning',
        root: 'bg-warning/20'
      }
    },
    size: {
      '2xl': {
        root: 'h-4'
      },
      'lg': {
        root: 'h-3'
      },
      'md': {
        root: 'h-2.5'
      },
      'sm': {
        root: 'h-2'
      },
      'xl': {
        root: 'h-3.5'
      },
      'xs': {
        root: 'h-1.75'
      }
    }
  }
});

export type ProgressSlots = keyof typeof progressVariants.slots;
