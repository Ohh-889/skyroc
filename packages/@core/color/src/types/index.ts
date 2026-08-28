/**
 * The color palette number
 *
 * The main color number is 500
 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** The color palette */
export type ColorPalette = {
  /** The color hex value */
  hex: string;
  /**
   * The color number
   *
   * - 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
   */
  number: ColorPaletteNumber;
};

/** The color palette family */
export type ColorPaletteFamily = {
  /** The color palette family name */
  name: string;
  /** The color palettes */
  palettes: ColorPalette[];
};

/** The color palette with delta */
export type ColorPaletteWithDelta = ColorPalette & {
  delta: number;
};

/** The color palette family with nearest palette */
export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestLightnessPalette: ColorPaletteWithDelta;
  nearestPalette: ColorPaletteWithDelta;
};

/** The color palette match */
export type ColorPaletteMatch = ColorPaletteFamily & {
  /** The color map of the palette */
  colorMap: Map<ColorPaletteNumber, ColorPalette>;
  /**
   * The main color of the palette
   *
   * Which number is 500
   */
  main: ColorPalette;
  /** The match color of the palette */
  match: ColorPalette;
};

/**
 * The color index of color palette
 *
 * From left to right, the color is from light to dark, 6 is main color
 */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * The palette generation algorithm
 *
 * - Antd: Ant Design HSV algorithm (classic, index 6 = main color)
 * - Recommended: deltaE nearest-family matching against built-in Tailwind palettes
 * - Oklch: OKLCH perceptually uniform algorithm with chroma compensation and hue rotation
 */
export type PaletteAlgorithm = 'antd' | 'oklch' | 'recommended';
