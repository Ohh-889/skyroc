import { tv } from 'tailwind-variants';

export const radioVariants = tv({
  defaultVariants: {
    color: 'primary',
    orientation: 'horizontal',
    size: 'md',
    variant: 'dot'
  },
  slots: {
    card: [
      'relative w-fit inline-flex cursor-pointer items-center gap-3 border p-3 transition-all border rounded-md',
      'hover:bg-accent/50'
    ],
    cardContent: 'flex flex-1 items-center gap-2',
    cardDescription: 'text-muted-foreground text-xs',
    cardLabel: 'text-sm leading-none font-medium',
    cardTextContent: 'flex flex-col gap-0.5',
    control: [
      'peer relative shrink-0 rounded-full border shadow',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ],
    group: 'flex',
    indicator: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1/2 rounded-full ',
    label: '',
    root: 'flex items-center'
  },
  variants: {
    color: {
      accent: {
        card: 'data-[state=checked]:border-accent-foreground/50',
        control: `border-accent-foreground focus-visible:ring-accent-foreground/20`,
        indicator: `bg-accent-foreground/60`
      },
      carbon: {
        card: 'data-[state=checked]:border-carbon',
        control: `border-carbon focus-visible:ring-carbon`,
        indicator: `bg-carbon`
      },
      destructive: {
        card: 'data-[state=checked]:border-destructive',
        control: `border-destructive focus-visible:ring-destructive`,
        indicator: `bg-destructive`
      },
      info: {
        card: 'data-[state=checked]:border-info',
        control: `border-info focus-visible:ring-info`,
        indicator: `bg-info`
      },
      primary: {
        card: 'data-[state=checked]:border-primary',
        control: `border-primary focus-visible:ring-primary`,
        indicator: `bg-primary`
      },
      secondary: {
        card: 'data-[state=checked]:border-secondary-foreground/50',
        control: `border-secondary-foreground focus-visible:ring-secondary-foreground/20`,
        indicator: `bg-secondary-foreground/60`
      },
      success: {
        card: 'data-[state=checked]:border-success',
        control: `border-success focus-visible:ring-success`,
        indicator: `bg-success`
      },
      warning: {
        card: 'data-[state=checked]:border-warning',
        control: `border-warning focus-visible:ring-warning`,
        indicator: `bg-warning`
      }
    },
    orientation: {
      horizontal: {
        group: 'items-center'
      },
      vertical: {
        group: 'flex-col'
      }
    },
    size: {
      '2xl': {
        card: 'gap-6 text-xl p-6',
        cardContent: 'gap-6',
        cardDescription: 'text-lg',
        cardTextContent: 'gap-2.5',
        control: 'size-6',
        group: 'gap-x-4.5 gap-y-3.5',
        root: 'gap-3.5'
      },
      'lg': {
        card: 'gap-4 text-base p-4',
        cardContent: 'gap-4',
        cardDescription: 'text-sm',
        cardTextContent: 'gap-1.5',
        control: 'size-4.5',
        group: 'gap-x-3.5 gap-y-2.5',
        root: 'gap-2.5'
      },
      'md': {
        card: 'gap-3 text-sm p-3',
        cardContent: 'gap-3',
        cardDescription: 'text-xs',
        cardTextContent: 'gap-1',
        control: 'size-4',
        group: 'gap-x-3 gap-y-2',
        root: 'gap-2'
      },
      'sm': {
        card: 'gap-2.5 text-xs p-2.5',
        cardContent: 'gap-2.5',
        cardDescription: 'text-2xs',
        cardTextContent: 'gap-0.75',
        control: 'size-3.5',
        group: 'gap-x-2.5 gap-y-1.75',
        root: 'gap-1.75'
      },
      'xl': {
        card: 'gap-5 text-lg p-5',
        cardContent: 'gap-5',
        cardDescription: 'text-base',
        cardTextContent: 'gap-2',
        control: 'size-5',
        group: 'gap-x-4 gap-y-3',
        root: 'gap-3'
      },
      'xs': {
        card: 'gap-2 text-2xs p-2',
        cardContent: 'gap-2',
        cardDescription: 'text-3xs',
        cardTextContent: 'gap-0.5',
        control: 'size-3',
        group: 'gap-x-2 gap-y-1.5',
        root: 'gap-1.5'
      }
    },
    variant: {
      dot: {
        indicator: ''
      },
      outline: {
        control: ''
      }
    }
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-primary',
        indicator: 'bg-background'
      }
    },
    {
      color: 'destructive',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-destructive',
        indicator: 'bg-background'
      }
    },
    {
      color: 'success',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-success',
        indicator: 'bg-background'
      }
    },
    {
      color: 'warning',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-warning',
        indicator: 'bg-background'
      }
    },
    {
      color: 'info',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-info',
        indicator: 'bg-background'
      }
    },
    {
      color: 'carbon',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-carbon',
        indicator: 'bg-background'
      }
    },
    {
      color: 'secondary',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-secondary-foreground',
        indicator: 'bg-background'
      }
    },
    {
      color: 'accent',
      variant: 'outline',
      class: {
        control: 'data-[state=checked]:bg-accent-foreground',
        indicator: 'bg-background'
      }
    }
  ]
});

export type RadioSlots = keyof typeof radioVariants.slots;
