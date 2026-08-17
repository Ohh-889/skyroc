import { tv } from 'tailwind-variants';
import type { ThemeSize } from '@skyroc/ui-types';

/** Maps size preset to track dimensions */
export const SIZE_TRACK_MAP: Record<ThemeSize, { height: number; width: number }> = {
  '2xl': { height: 28, width: 52 },
  lg: { height: 22, width: 40 },
  md: { height: 20, width: 36 },
  sm: { height: 18, width: 32 },
  xl: { height: 24, width: 44 },
  xs: { height: 16, width: 28 }
};

/** Maps size preset to thumb diameter */
export const SIZE_THUMB_MAP: Record<ThemeSize, number> = {
  '2xl': 24,
  lg: 18,
  md: 16,
  sm: 14,
  xl: 20,
  xs: 12
};

export const switchVariants = tv({
  slots: {
    checkedOverlay: 'absolute h-full w-full rounded-full',
    indicator: '',
    thumb: 'absolute items-center justify-center rounded-full bg-background shadow-sm h-full w-full',
    uncheckedBg: 'absolute h-full w-full rounded-full bg-muted-foreground/30'
  },
  variants: {
    color: {
      accent: { checkedOverlay: 'bg-accent', indicator: 'text-accent' },
      carbon: { checkedOverlay: 'bg-carbon', indicator: 'text-carbon' },
      destructive: { checkedOverlay: 'bg-destructive', indicator: 'text-destructive' },
      info: { checkedOverlay: 'bg-info', indicator: 'text-info' },
      primary: { checkedOverlay: 'bg-primary', indicator: 'text-primary' },
      secondary: { checkedOverlay: 'bg-secondary', indicator: 'text-secondary' },
      success: { checkedOverlay: 'bg-success', indicator: 'text-success' },
      warning: { checkedOverlay: 'bg-warning', indicator: 'text-warning' }
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
});
