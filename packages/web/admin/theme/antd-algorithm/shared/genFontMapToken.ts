import type { FontMapToken } from 'antd/lib/theme/interface';

/**
 * Font size configuration
 *
 * Based on UnoCSS text rules, using rem units Conversion: 1rem = 16px (browser default)
 *
 * | Name | rem   | px  | lineHeight rem | lineHeight px |
 * | ---- | ----- | --- | -------------- | ------------- |
 * | xs   | 0.75  | 12  | 1.125          | 18            |
 * | sm   | 0.875 | 14  | 1.375          | 22            |
 * | base | 1     | 16  | 1.5            | 24            |
 * | lg   | 1.125 | 18  | 1.625          | 26            |
 * | xl   | 1.25  | 20  | 1.75           | 28            |
 * | 2xl  | 1.5   | 24  | 2              | 32            |
 * | 3xl  | 1.875 | 30  | 2.375          | 38            |
 * | 4xl  | 2.25  | 36  | 2.75           | 44            |
 * | 5xl  | 3     | 48  | 3.5            | 56            |
 * | 6xl  | 3.75  | 60  | 4.25           | 68            |
 * | 7xl  | 4.5   | 72  | 5              | 80            |
 * | 8xl  | 6     | 96  | 6.5            | 104           |
 * | 9xl  | 8     | 128 | 8.5            | 136           |
 */

/** Font size table (rem) */
export const FONT_SIZES = {
  xs: 0.75, // 12px
  sm: 0.875, // 14px
  base: 1, // 16px
  lg: 1.125, // 18px
  xl: 1.25, // 20px
  '2xl': 1.5, // 24px
  '3xl': 1.875, // 30px
  '4xl': 2.25, // 36px
  '5xl': 3, // 48px
  '6xl': 3.75, // 60px
  '7xl': 4.5, // 72px
  '8xl': 6, // 96px
  '9xl': 8 // 128px
} as const;

/** Line height table (rem) */
export const LINE_HEIGHTS = {
  xs: 1.125, // 18px
  sm: 1.375, // 22px
  base: 1.5, // 24px
  lg: 1.625, // 26px
  xl: 1.75, // 28px
  '2xl': 2, // 32px
  '3xl': 2.375, // 38px
  '4xl': 2.75, // 44px
  '5xl': 3.5, // 56px
  '6xl': 4.25, // 68px
  '7xl': 5, // 80px
  '8xl': 6.5, // 104px
  '9xl': 8.5 // 136px
} as const;

export type FontSizeKey = keyof typeof FONT_SIZES;

/**
 * Convert rem to px
 *
 * @param rem Rem value
 * @param baseFontSize Base font size (default 16)
 */
export function remToPx(rem: number, baseFontSize = 16): number {
  return Math.round(rem * baseFontSize);
}

/**
 * Calculate line height ratio
 *
 * @param fontSize Font size (rem)
 * @param lineHeight Line height (rem)
 */
export function getLineHeightRatio(fontSize: number, lineHeight: number): number {
  return Number((lineHeight / fontSize).toFixed(3));
}

interface FontSizePair {
  lineHeight: number;
  lineHeightRatio: number;
  size: number;
}

/** Extended font map token with custom text sizes */
export interface ExtendedFontMapToken extends FontMapToken {
  /** Base font height (px) */
  fontHeight: number;
  /** Large font height (px) */
  fontHeightLG: number;
  /** Small font height (px) */
  fontHeightSM: number;

  /** Heading level 1 font size generated in px */
  fontSizeHeading1: number;
  /** Heading level 2 font size generated in px */
  fontSizeHeading2: number;
  /** Heading level 3 font size generated in px */
  fontSizeHeading3: number;
  /** Heading level 4 font size generated in px */
  fontSizeHeading4: number;
  /** Heading level 5 font size generated in px */
  fontSizeHeading5: number;

  /** 2x large line height (px) */
  LineHeight2xl: number;
  /** 3x large line height (px) */
  LineHeight3xl: number;
  /** 4x large line height (px) */
  LineHeight4xl: number;
  /** 5x large line height (px) */
  LineHeight5xl: number;
  /** 6x large line height (px) */
  LineHeight6xl: number;
  /** 7x large line height (px) */
  LineHeight7xl: number;
  /** 8x large line height (px) */
  LineHeight8xl: number;
  /** 9x large line height (px) */
  LineHeight9xl: number;
  /** Base line height (px) */
  LineHeightBase: number;
  /** Large line height (px) */
  LineHeightLg: number;
  /** Small line height (px) */
  LineHeightSm: number;
  /** Extra large line height (px) */
  LineHeightXl: number;
  /** Extra small line height (px) */
  LineHeightXs: number;

  /** 2x large text size (24px) */
  Text2xl: number;
  /** 3x large text size (30px) */
  Text3xl: number;
  /** 4x large text size (36px) */
  Text4xl: number;
  /** 5x large text size (48px) */
  Text5xl: number;
  /** 6x large text size (60px) */
  Text6xl: number;
  /** 7x large text size (72px) */
  Text7xl: number;
  /** 8x large text size (96px) */
  Text8xl: number;
  /** 9x large text size (128px) */
  Text9xl: number;
  /** Base text size (16px) */
  TextBase: number;
  /** Large text size (18px) */
  TextLg: number;
  /** Small text size (14px) */
  TextSm: number;
  /** Extra large text size (20px) */
  TextXl: number;
  /** Extra small text size (12px) */
  TextXs: number;
}

/**
 * Generate font size pairs
 *
 * @param baseFontSize Base font size (px), default 16
 */
export function genFontSizes(baseFontSize = 16): FontSizePair[] {
  const keys: FontSizeKey[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

  return keys.map(key => {
    const fontSizeRem = FONT_SIZES[key];
    const lineHeightRem = LINE_HEIGHTS[key];
    const size = remToPx(fontSizeRem, baseFontSize);
    const lineHeight = remToPx(lineHeightRem, baseFontSize);

    return {
      lineHeight,
      lineHeightRatio: getLineHeightRatio(fontSizeRem, lineHeightRem),
      size
    };
  });
}

/**
 * Generate font map token
 *
 * Based on UnoCSS font rules, generate Ant Design style font tokens
 *
 * Mapping: - fontSizeSM: sm (14px) - fontSize: base (16px) - fontSizeLG: lg (18px) - fontSizeXL: xl (20px) -
 * fontSizeHeading5: xl (20px) - fontSizeHeading4: 2xl (24px) - fontSizeHeading3: 3xl (30px) - fontSizeHeading2: 4xl
 * (36px) - fontSizeHeading1: 5xl (48px)
 *
 * @param baseFontSize Base font size (px), default 16
 */
export function genFontMapToken(baseFontSize = 16): ExtendedFontMapToken {
  const fontSizePairs = genFontSizes(baseFontSize);

  // Index mapping: xs=0, sm=1, base=2, lg=3, xl=4, 2xl=5, 3xl=6, 4xl=7, 5xl=8
  const fontSizes = fontSizePairs.map(pair => pair.size);
  const lineHeights = fontSizePairs.map(pair => pair.lineHeightRatio);
  const lineHeightsPx = fontSizePairs.map(pair => pair.lineHeight);

  // SM = sm (index 1)
  const fontSizeSM = fontSizes[1];
  const lineHeightSM = lineHeights[1];

  // MD = base (index 2)
  const fontSizeMD = fontSizes[2];
  const lineHeightMD = lineHeights[2];

  // LG = lg (index 3)
  const fontSizeLG = fontSizes[3];
  const lineHeightLG = lineHeights[3];

  return {
    // Base font sizes
    fontSize: fontSizeMD,
    fontSizeLG,
    fontSizeSM,
    fontSizeXL: fontSizes[4], // xl (20px)
    TextXs: fontSizes[0],
    TextSm: fontSizes[1],
    TextBase: fontSizes[2],
    TextLg: fontSizes[3],
    TextXl: fontSizes[4],
    Text2xl: fontSizes[5],
    Text3xl: fontSizes[6],
    Text4xl: fontSizes[7],
    Text5xl: fontSizes[8],
    Text6xl: fontSizes[9],
    Text7xl: fontSizes[10],
    Text8xl: fontSizes[11],
    Text9xl: fontSizes[12],
    LineHeightXs: lineHeightsPx[0],
    LineHeightSm: lineHeightsPx[1],
    LineHeightBase: lineHeightsPx[2],
    LineHeightLg: lineHeightsPx[3],
    LineHeightXl: lineHeightsPx[4],
    LineHeight2xl: lineHeightsPx[5],
    LineHeight3xl: lineHeightsPx[6],
    LineHeight4xl: lineHeightsPx[7],
    LineHeight5xl: lineHeightsPx[8],
    LineHeight6xl: lineHeightsPx[9],
    LineHeight7xl: lineHeightsPx[10],
    LineHeight8xl: lineHeightsPx[11],
    LineHeight9xl: lineHeightsPx[12],

    // Heading font sizes (large to small)
    fontSizeHeading1: fontSizes[8], // 5xl (48px)
    fontSizeHeading2: fontSizes[7], // 4xl (36px)
    fontSizeHeading3: fontSizes[6], // 3xl (30px)
    fontSizeHeading4: fontSizes[5], // 2xl (24px)
    fontSizeHeading5: fontSizes[4], // xl (20px)

    // Line height ratios
    lineHeight: lineHeightMD,
    lineHeightLG,
    lineHeightSM,

    // Line heights (px)
    fontHeight: Math.round(lineHeightMD * fontSizeMD),
    fontHeightLG: Math.round(lineHeightLG * fontSizeLG),
    fontHeightSM: Math.round(lineHeightSM * fontSizeSM),

    // Heading line heights
    lineHeightHeading1: lineHeights[8], // 5xl
    lineHeightHeading2: lineHeights[7], // 4xl
    lineHeightHeading3: lineHeights[6], // 3xl
    lineHeightHeading4: lineHeights[5], // 2xl
    lineHeightHeading5: lineHeights[4] // xl
  };
}

export default genFontMapToken;
