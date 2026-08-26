import { tv } from 'tailwind-variants';

export const sliderVariants = tv({
  defaultVariants: {
    color: 'primary',
    size: 'md'
  },
  slots: {
    range: `absolute h-full data-[orientation=vertical]:w-full`,
    root: [
      `relative flex w-full touch-none select-none items-center`,
      `data-[orientation=vertical]:flex-col data-[orientation=vertical]:h-full`
    ],
    thumb: [
      `block rounded-full bg-background transition-colors duration-200`,
      `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
      `disabled:cursor-not-allowed disabled:opacity-50`
    ],
    track: `relative w-full grow overflow-hidden rounded-full`
  },
  variants: {
    color: {
      accent: {
        range: 'bg-accent-foreground',
        thumb: 'border-accent-foreground focus-visible:ring-accent-foreground',
        track: 'bg-accent-foreground/20'
      },
      carbon: {
        range: 'bg-carbon',
        thumb: 'border-carbon focus-visible:ring-carbon',
        track: 'bg-carbon/20'
      },
      destructive: {
        range: 'bg-destructive',
        thumb: 'border-destructive focus-visible:ring-destructive',
        track: 'bg-destructive/20'
      },
      info: {
        range: 'bg-info',
        thumb: 'border-info focus-visible:ring-info',
        track: 'bg-info/20'
      },
      primary: {
        range: 'bg-primary',
        thumb: 'border-primary focus-visible:ring-primary',
        track: 'bg-primary/20'
      },
      secondary: {
        range: 'bg-secondary-foreground',
        thumb: 'border-secondary-foreground focus-visible:ring-secondary-foreground',
        track: 'bg-secondary-foreground/20'
      },
      success: {
        range: 'bg-success',
        thumb: 'border-success focus-visible:ring-success',
        track: 'bg-success/20'
      },
      warning: {
        range: 'bg-warning',
        thumb: 'border-warning focus-visible:ring-warning',
        track: 'bg-warning/20'
      }
    },
    size: {
      '2xl': {
        root: 'data-[orientation=vertical]:w-3.5',
        thumb: 'size-7 border-[3.5px]',
        track: 'h-3.5 data-[orientation=vertical]:w-3.5'
      },
      'lg': {
        root: 'data-[orientation=vertical]:w-2.5',
        thumb: 'size-5.5 border-[2.5px]',
        track: 'h-2.5 data-[orientation=vertical]:w-2.5'
      },
      'md': {
        root: 'data-[orientation=vertical]:w-2',
        thumb: 'size-5 border-2',
        track: 'h-2 data-[orientation=vertical]:w-2'
      },
      'sm': {
        root: 'data-[orientation=vertical]:w-1.5',
        thumb: 'size-4.5 border-[1.75px]',
        track: 'h-1.5 data-[orientation=vertical]:w-1.5'
      },
      'xl': {
        root: 'data-[orientation=vertical]:w-3',
        thumb: 'size-6 border-3',
        track: 'h-3 data-[orientation=vertical]:w-3'
      },
      'xs': {
        root: 'data-[orientation=vertical]:w-1.25',
        thumb: 'size-4 border-[1.5px]',
        track: 'h-1.25 data-[orientation=vertical]:w-1.25'
      }
    }
  }
});

export type SliderSlots = keyof typeof sliderVariants.slots;
