import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const alertVariants = tv({
  compoundVariants: [
    {
      class: {
        close: 'text-primary-foreground',
        icon: 'text-primary-foreground',
        root: 'bg-primary text-primary-foreground'
      },
      color: 'primary',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-destructive-foreground',
        icon: 'text-destructive-foreground',
        root: 'bg-destructive text-destructive-foreground'
      },
      color: 'destructive',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-success-foreground',
        icon: 'text-success-foreground',
        root: 'bg-success text-success-foreground'
      },
      color: 'success',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-warning-foreground',
        icon: 'text-warning-foreground',
        root: 'bg-warning text-warning-foreground'
      },
      color: 'warning',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-info-foreground',
        icon: 'text-info-foreground',
        root: 'bg-info text-info-foreground'
      },
      color: 'info',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-carbon-foreground',
        icon: 'text-carbon-foreground',
        root: 'bg-carbon text-carbon-foreground'
      },
      color: 'carbon',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-secondary-foreground',
        icon: 'text-secondary-foreground',
        root: 'bg-secondary text-secondary-foreground'
      },
      color: 'secondary',
      variant: 'solid'
    },
    {
      class: {
        close: 'text-accent-foreground',
        icon: 'text-accent-foreground',
        root: 'bg-accent text-accent-foreground'
      },
      color: 'accent',
      variant: 'solid'
    },
    {
      class: {
        root: 'bg-primary/10'
      },
      color: 'primary',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-destructive/10'
      },
      color: 'destructive',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-success/10'
      },
      color: 'success',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-warning/10'
      },
      color: 'warning',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-info/10'
      },
      color: 'info',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-carbon/10'
      },
      color: 'carbon',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-secondary-foreground/5'
      },
      color: 'secondary',
      variant: ['soft', 'ghost']
    },
    {
      class: {
        root: 'bg-accent-foreground/5'
      },
      color: 'accent',
      variant: ['soft', 'ghost']
    }
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
    variant: 'ghost'
  },
  slots: {
    action: 'shrink-0',
    close: 'absolute',
    description: '[&_p]:leading-relaxed',
    icon: 'shrink-0',
    root: 'relative flex w-full rounded-lg border',
    title: 'font-medium tracking-tight',
    wrapper: 'flex-1 flex flex-col'
  },
  variants: {
    color: {
      accent: {
        icon: 'text-accent-foreground',
        root: 'border-accent-foreground/50 text-accent-foreground'
      },
      carbon: {
        icon: 'text-carbon',
        root: 'border-carbon text-carbon'
      },
      destructive: {
        icon: 'text-destructive',
        root: 'border-destructive text-destructive'
      },
      info: {
        icon: 'text-info',
        root: 'border-info text-info'
      },
      primary: {
        icon: 'text-primary',
        root: 'border-primary text-primary'
      },
      secondary: {
        icon: 'text-secondary-foreground',
        root: 'border-secondary-foreground/50 text-secondary-foreground'
      },
      success: {
        icon: 'text-success',
        root: 'border-success text-success'
      },
      warning: {
        icon: 'text-warning',
        root: 'border-warning text-warning'
      }
    },
    size: {
      '2xl': {
        close: 'top-4 right-7',
        root: 'gap-4.5 px-7 py-4.5 text-xl',
        title: 'text-2xl leading-6.25',
        wrapper: 'gap-2'
      },
      'lg': {
        close: 'top-3 right-5',
        root: 'gap-3.5 px-5 py-3.5 text-base',
        title: 'text-lg leading-5',
        wrapper: 'gap-1.25'
      },
      'md': {
        close: 'top-2.5 right-4',
        root: 'gap-3 px-4 py-3 text-sm',
        title: 'text-base leading-[calc(var(--spacing)*4.375)]',
        wrapper: 'gap-1'
      },
      'sm': {
        close: 'top-2 right-3',
        root: 'gap-2.5 px-3 py-2.5 text-xs',
        title: 'text-sm leading-3.75',
        wrapper: 'gap-1'
      },
      'xl': {
        close: 'top-3.5 right-6',
        root: 'gap-4 px-6 py-4 text-lg',
        title: 'text-xl leading-[var(--spacing)*5.625]',
        wrapper: 'gap-1.5'
      },
      'xs': {
        close: 'top-1.25 right-2',
        root: 'gap-2 px-2 py-1.75 text-2xs',
        title: 'text-xs leading-[calc(var(--spacing)*3.125)]',
        wrapper: 'gap-0.75'
      }
    },
    variant: {
      ghost: {
        root: ''
      },
      outline: {
        root: 'bg-background'
      },
      pure: {
        root: 'bg-background text-foreground border-border'
      },
      soft: {
        root: 'border-0'
      },
      solid: {
        root: ''
      }
    }
  }
});

type AlertVariants = VariantProps<typeof alertVariants>;

export type AlertVariant = NonNullable<AlertVariants['variant']>;

export type AlertSlots = keyof typeof alertVariants.slots;
