import { tv } from 'tailwind-variants';
import type { ThemeSize } from '@skyroc/ui-types';

/** Maps size preset to control (circle/square) pixel size */
export const SIZE_CONTROL_MAP: Record<ThemeSize, number> = {
  '2xl': 32,
  lg: 24,
  md: 20,
  sm: 16,
  xl: 28,
  xs: 14
};

/** Maps size preset to inner icon (check) pixel size for square shape */
export const SIZE_INNER_ICON_MAP: Record<ThemeSize, number> = {
  '2xl': 20,
  lg: 16,
  md: 14,
  sm: 11,
  xl: 18,
  xs: 9
};

/** Maps size preset to inner dot pixel size for round shape */
export const SIZE_DOT_MAP: Record<ThemeSize, number> = {
  '2xl': 16,
  lg: 12,
  md: 10,
  sm: 8,
  xl: 14,
  xs: 6
};

export const radioVariants = tv({
  slots: {
    control: 'items-center justify-center h-full w-full',
    dot: 'rounded-full h-full w-full',
    label: 'text-base text-foreground',
    root: 'flex-row items-center'
  },
  variants: {
    active: {
      false: { control: 'border-1 border-muted-foreground/50' },
      true: { control: '' }
    },
    color: {
      accent: {},
      carbon: {},
      destructive: {},
      info: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {}
    },
    disabled: {
      true: {
        label: 'text-muted-foreground',
        root: 'opacity-50'
      }
    },
    labelPosition: {
      left: { root: 'flex-row-reverse' },
      right: { root: '' }
    },
    shape: {
      round: { control: 'rounded-full' },
      square: { control: 'rounded' }
    },
    size: {
      '2xl': { label: 'text-lg', root: 'gap-3.5' },
      lg: { label: 'text-base', root: 'gap-2.5' },
      md: { label: 'text-base', root: 'gap-2' },
      sm: { label: 'text-sm', root: 'gap-1.5' },
      xl: { label: 'text-base', root: 'gap-3' },
      xs: { label: 'text-xs', root: 'gap-1' }
    }
  },
  compoundVariants: [
    // Round shape active: colored border + colored dot
    {
      active: true,
      class: { control: 'border-1 border-primary', dot: 'bg-primary' },
      color: 'primary',
      shape: 'round'
    },
    {
      active: true,
      class: { control: 'border-1 border-destructive', dot: 'bg-destructive' },
      color: 'destructive',
      shape: 'round'
    },
    {
      active: true,
      class: { control: 'border-1 border-success', dot: 'bg-success' },
      color: 'success',
      shape: 'round'
    },
    {
      active: true,
      class: { control: 'border-1 border-warning', dot: 'bg-warning' },
      color: 'warning',
      shape: 'round'
    },
    { active: true, class: { control: 'border-1 border-info', dot: 'bg-info' }, color: 'info', shape: 'round' },
    { active: true, class: { control: 'border-1 border-accent', dot: 'bg-accent' }, color: 'accent', shape: 'round' },
    { active: true, class: { control: 'border-1 border-carbon', dot: 'bg-carbon' }, color: 'carbon', shape: 'round' },
    {
      active: true,
      class: { control: 'border-1 border-secondary', dot: 'bg-secondary' },
      color: 'secondary',
      shape: 'round'
    },
    // Square shape active: filled background (same as checkbox)
    { active: true, class: { control: 'bg-primary' }, color: 'primary', shape: 'square' },
    { active: true, class: { control: 'bg-destructive' }, color: 'destructive', shape: 'square' },
    { active: true, class: { control: 'bg-success' }, color: 'success', shape: 'square' },
    { active: true, class: { control: 'bg-warning' }, color: 'warning', shape: 'square' },
    { active: true, class: { control: 'bg-info' }, color: 'info', shape: 'square' },
    { active: true, class: { control: 'bg-accent' }, color: 'accent', shape: 'square' },
    { active: true, class: { control: 'bg-carbon' }, color: 'carbon', shape: 'square' },
    { active: true, class: { control: 'bg-secondary' }, color: 'secondary', shape: 'square' }
  ],
  defaultVariants: {
    active: false,
    color: 'primary',
    disabled: false,
    labelPosition: 'right',
    shape: 'round',
    size: 'md'
  }
});

export const radioGroupVariants = tv({
  base: 'gap-3',
  variants: {
    direction: {
      horizontal: 'flex-row flex-wrap',
      vertical: 'flex-col'
    },
    size: {
      '2xl': 'gap-x-4.5 gap-y-3.5',
      lg: 'gap-x-3.5 gap-y-2.5',
      md: 'gap-x-3 gap-y-2',
      sm: 'gap-x-2.5 gap-y-1.5',
      xl: 'gap-x-4 gap-y-3',
      xs: 'gap-x-2 gap-y-1'
    }
  },
  defaultVariants: {
    direction: 'vertical',
    size: 'md'
  }
});

export const radioCardVariants = tv({
  slots: {
    card: 'flex-row items-center gap-3 rounded-xl border border-border bg-card p-3',
    cardContent: 'flex-1 flex-row items-center gap-2.5',
    cardDescription: 'text-xs text-muted-foreground',
    cardLabel: 'text-sm font-medium text-foreground'
  },
  variants: {
    disabled: {
      true: {
        card: 'opacity-50'
      }
    }
  },
  defaultVariants: {
    disabled: false
  }
});
