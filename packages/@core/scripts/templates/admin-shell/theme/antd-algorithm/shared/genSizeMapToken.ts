import type { SizeMapToken } from 'antd/lib/theme/interface';

/**
 * Spacing configuration
 *
 * Based on UnoCSS spacing rules, using sizeUnit as base unit Default sizeUnit = 4px
 *
 * | Name | Multiplier | px (sizeUnit=4) |
 * | ---- | ---------- | --------------- |
 * | 3xs  | 1          | 4               |
 * | 2xs  | 2          | 8               |
 * | xs   | 3          | 12              |
 * | md   | 4          | 16              |
 * | lg   | 5          | 20              |
 * | xl   | 6          | 24              |
 * | 2xl  | 8          | 32              |
 * | 3xl  | 10         | 40              |
 * | 4xl  | 12         | 48              |
 * | 5xl  | 16         | 64              |
 * | 6xl  | 20         | 80              |
 * | 7xl  | 24         | 96              |
 * | 8xl  | 32         | 128             |
 * | 9xl  | 36         | 144             |
 */

/** Spacing multipliers (based on sizeUnit) */
export const SPACING_MULTIPLIERS = {
  '3xs': 1, // 4px (sizeUnit * 1)
  '2xs': 2, // 8px (sizeUnit * 2)
  xs: 3, // 12px (sizeUnit * 3)
  md: 4, // 16px (sizeUnit * 4)
  lg: 5, // 20px (sizeUnit * 5)
  xl: 6, // 24px (sizeUnit * 6)
  '2xl': 8, // 32px (sizeUnit * 8)
  '3xl': 10, // 40px (sizeUnit * 10)
  '4xl': 12, // 48px (sizeUnit * 12)
  '5xl': 16, // 64px (sizeUnit * 16)
  '6xl': 20, // 80px (sizeUnit * 20)
  '7xl': 24, // 96px (sizeUnit * 24)
  '8xl': 32, // 128px (sizeUnit * 32)
  '9xl': 36 // 144px (sizeUnit * 36)
} as const;

export type SpacingSizeKey = keyof typeof SPACING_MULTIPLIERS;

/**
 * Calculate spacing size
 *
 * @param multiplier Multiplier
 * @param sizeUnit Base unit (default 4)
 */
export function calcSpacing(multiplier: number, sizeUnit = 4): number {
  return sizeUnit * multiplier;
}

/**
 * Generate size map token
 *
 * Based on sizeUnit, generate Ant Design style size tokens
 *
 * Mapping (sizeUnit = 4): - sizeXXS: 3xs (4px) = sizeUnit * 1 - sizeXS: 2xs (8px) = sizeUnit * 2 - sizeSM: xs (12px) =
 * sizeUnit * 3 - size/sizeMS: md (16px) = sizeUnit * 4 - sizeMD: lg (20px) = sizeUnit * 5 - sizeLG: xl (24px) =
 * sizeUnit * 6 - sizeXL: 2xl (32px) = sizeUnit * 8 - sizeXXL: 4xl (48px) = sizeUnit * 12
 *
 * @param sizeUnit Base unit (px), default 4
 */
export function genSizeMapToken(sizeUnit = 4): SizeMapToken {
  return {
    // Ant Design standard size tokens
    sizeXXS: sizeUnit * SPACING_MULTIPLIERS['3xs'], // 4px
    sizeXS: sizeUnit * SPACING_MULTIPLIERS['2xs'], // 8px
    sizeSM: sizeUnit * SPACING_MULTIPLIERS.xs, // 12px
    sizeMS: sizeUnit * SPACING_MULTIPLIERS.md, // 16px
    size: sizeUnit * SPACING_MULTIPLIERS.md, // 16px
    sizeMD: sizeUnit * SPACING_MULTIPLIERS.lg, // 20px
    sizeLG: sizeUnit * SPACING_MULTIPLIERS.xl, // 24px
    sizeXL: sizeUnit * SPACING_MULTIPLIERS['2xl'], // 32px
    sizeXXL: sizeUnit * SPACING_MULTIPLIERS['4xl'] // 48px
  };
}

/**
 * Generate complete spacing table
 *
 * @param sizeUnit Base unit (px), default 4
 */
export function genSpacingSizes(sizeUnit = 4): Record<SpacingSizeKey, number> {
  return Object.entries(SPACING_MULTIPLIERS).reduce(
    (acc, [key, multiplier]) => {
      acc[key as SpacingSizeKey] = sizeUnit * multiplier;
      return acc;
    },
    {} as Record<SpacingSizeKey, number>
  );
}

/**
 * Generate spacing CSS variables
 *
 * @param sizeUnit Base unit (px), default 4
 */
export function genSpacingVars(sizeUnit = 4): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, multiplier] of Object.entries(SPACING_MULTIPLIERS)) {
    const px = sizeUnit * multiplier;
    result[`spacing-${key}`] = `${px}px`;
    result[`spacing${key.replace(/^(\d)/, '_$1')}`] = `${px}px`; // spacing_3xs, spacing_2xs, etc.
  }

  return result;
}

export default genSizeMapToken;
