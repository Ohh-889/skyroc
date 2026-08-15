import { tv } from 'tailwind-variants';
import type { ThemeSize } from '@skyroc/ui-types';

/** Maps size preset to control (box/circle) pixel size */
export const SIZE_CONTROL_MAP: Record<ThemeSize, number> = {
  '2xl': 32,
  lg: 24,
  md: 20,
  sm: 16,
  xl: 28,
  xs: 14
};

/**
 * Maps size preset to label line-height (px)
 *
 * Used to set the control container height so that the checkbox icon
 * vertically centers with the first line of a multi-line label.
 *
 * Values follow Tailwind CSS v4 line-height defaults:
 *   text-xs → 16px, text-sm → 20px, text-base → 24px, text-lg → 28px
 */
export const SIZE_LABEL_LINE_HEIGHT_MAP: Record<ThemeSize, number> = {
  '2xl': 28,
  lg: 24,
  md: 24,
  sm: 20,
  xl: 24,
  xs: 16
};

/** Maps size preset to inner icon (check/minus) pixel size */
export const SIZE_INNER_ICON_MAP: Record<ThemeSize, number> = {
  '2xl': 20,
  lg: 16,
  md: 14,
  sm: 11,
  xl: 18,
  xs: 9
};

export const checkboxVariants = tv({
  slots: {
    control: 'items-center justify-center',
    label: 'text-base text-foreground',
    root: 'flex-row items-start'
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
    { active: true, class: { control: 'bg-primary' }, color: 'primary' },
    { active: true, class: { control: 'bg-destructive' }, color: 'destructive' },
    { active: true, class: { control: 'bg-success' }, color: 'success' },
    { active: true, class: { control: 'bg-warning' }, color: 'warning' },
    { active: true, class: { control: 'bg-info' }, color: 'info' },
    { active: true, class: { control: 'bg-accent' }, color: 'accent' },
    { active: true, class: { control: 'bg-carbon' }, color: 'carbon' },
    { active: true, class: { control: 'bg-secondary' }, color: 'secondary' }
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

export const checkboxGroupVariants = tv({
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

export const checkboxCardVariants = tv({
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
