import type { ThemeSize } from '../types';

export const themeSizeMap: Record<ThemeSize, number> = {
  '2xl': 24,
  'lg': 18,
  'md': 16,
  'sm': 14,
  'xl': 20,
  'xs': 12
};

export const themeSizeRatio = Object.fromEntries(
  Object.entries(themeSizeMap).map(([key, value]) => [key, value / themeSizeMap.md])
) as Record<ThemeSize, number>;
