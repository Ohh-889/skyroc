import type { MapToken } from 'antd/lib/theme/interface';

/**
 * Radius configuration
 *
 * Based on UnoCSS radius rules, using base radius value Default borderRadius = 6px
 *
 * | Name | Calculation   | px (radius=6) |
 * | ---- | ------------- | ------------- |
 * | none | 0             | 0             |
 * | xs   | radius / 3    | 2             |
 * | sm   | radius * 2/3  | 4             |
 * | md   | radius        | 6 (default)   |
 * | lg   | radius * 4/3  | 8             |
 * | xl   | radius * 2    | 12            |
 * | 2xl  | radius * 8/3  | 16            |
 * | 3xl  | radius * 4    | 24            |
 * | 4xl  | radius * 16/3 | 32            |
 * | full | 9999          | 9999          |
 */

/** Radius multipliers (based on borderRadius) */
export const RADIUS_MULTIPLIERS = {
  none: 0,
  xs: 1 / 3, // 2px (radius / 3)
  sm: 2 / 3, // 4px (radius * 2/3)
  md: 1, // 6px (radius) - default
  lg: 4 / 3, // 8px (radius * 4/3)
  xl: 2, // 12px (radius * 2)
  '2xl': 8 / 3, // 16px (radius * 8/3)
  '3xl': 4, // 24px (radius * 4)
  '4xl': 16 / 3, // 32px (radius * 16/3)
  full: -1 // Special value for 9999px
} as const;

export type RadiusSizeKey = keyof typeof RADIUS_MULTIPLIERS;

/**
 * Calculate radius size
 *
 * @param multiplier Multiplier
 * @param borderRadius Base radius (default 6)
 */
export function calcRadius(multiplier: number, borderRadius = 6): number {
  if (multiplier < 0) return 9999; // full
  return Math.round(borderRadius * multiplier);
}

/** Radius token type */
export type RadiusMapToken = Pick<
  MapToken,
  'borderRadius' | 'borderRadiusLG' | 'borderRadiusOuter' | 'borderRadiusSM' | 'borderRadiusXS'
>;

/**
 * Generate radius map token
 *
 * Based on base radius value, generate Ant Design style radius tokens
 *
 * Mapping (borderRadius = 6): - borderRadiusXS: xs (2px) = radius / 3 - borderRadiusSM: sm (4px) = radius * 2/3 -
 * borderRadius: md (6px) = radius - borderRadiusLG: lg (8px) = radius * 4/3 - borderRadiusOuter: sm (4px) = radius *
 * 2/3
 *
 * @param borderRadius Base radius value (px), default 6
 */
export function genRadiusMapToken(borderRadius = 6): RadiusMapToken {
  return {
    borderRadiusXS: calcRadius(RADIUS_MULTIPLIERS.xs, borderRadius), // 2px
    borderRadiusSM: calcRadius(RADIUS_MULTIPLIERS.sm, borderRadius), // 4px
    borderRadius, // 6px
    borderRadiusLG: calcRadius(RADIUS_MULTIPLIERS.lg, borderRadius), // 8px
    borderRadiusOuter: calcRadius(RADIUS_MULTIPLIERS.sm, borderRadius) // 4px
  };
}

/** Extended radius token (includes more sizes) */
export interface ExtendedRadiusToken extends RadiusMapToken {
  /** 2xl - 16px */
  borderRadius2XL: number;
  /** 3xl - 24px */
  borderRadius3XL: number;
  /** 4xl - 32px */
  borderRadius4XL: number;
  /** Full - 9999px */
  borderRadiusFull: number;
  /** Xl - 12px */
  borderRadiusXL: number;
}

/**
 * Generate extended radius token
 *
 * Includes complete UnoCSS radius series
 *
 * @param borderRadius Base radius value (px), default 6
 */
export function genExtendedRadiusToken(borderRadius = 6): ExtendedRadiusToken {
  return {
    ...genRadiusMapToken(borderRadius),
    borderRadiusXL: calcRadius(RADIUS_MULTIPLIERS.xl, borderRadius), // 12px
    borderRadius2XL: calcRadius(RADIUS_MULTIPLIERS['2xl'], borderRadius), // 16px
    borderRadius3XL: calcRadius(RADIUS_MULTIPLIERS['3xl'], borderRadius), // 24px
    borderRadius4XL: calcRadius(RADIUS_MULTIPLIERS['4xl'], borderRadius), // 32px
    borderRadiusFull: 9999 // 9999px
  };
}

/**
 * Generate complete radius table
 *
 * @param borderRadius Base radius value (px), default 6
 */
export function genRadiusSizes(borderRadius = 6): Record<RadiusSizeKey, number> {
  return Object.entries(RADIUS_MULTIPLIERS).reduce(
    (acc, [key, multiplier]) => {
      acc[key as RadiusSizeKey] = calcRadius(multiplier, borderRadius);
      return acc;
    },
    {} as Record<RadiusSizeKey, number>
  );
}

/**
 * Generate radius CSS variables
 *
 * @param borderRadius Base radius value (px), default 6
 */
export function genRadiusVars(borderRadius = 6): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, multiplier] of Object.entries(RADIUS_MULTIPLIERS)) {
    const px = calcRadius(multiplier, borderRadius);
    result[`radius-${key}`] = `${px}px`;
  }

  return result;
}

export default genRadiusMapToken;
