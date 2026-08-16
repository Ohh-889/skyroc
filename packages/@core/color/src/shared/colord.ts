import { colord, extend } from 'colord';
import type { AnyColor, HslColor, RgbColor } from 'colord';
import labPlugin from 'colord/plugins/lab';
import mixPlugin from 'colord/plugins/mix';
import namesPlugin from 'colord/plugins/names';

extend([namesPlugin, mixPlugin, labPlugin]);

export function isValidColor(color: AnyColor) {
  return colord(color).isValid();
}

export function getHex(color: AnyColor) {
  return colord(color).toHex();
}

export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

export function getHsl(color: AnyColor) {
  return colord(color).toHsl();
}

export function getHsv(color: AnyColor) {
  return colord(color).toHsv();
}

export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2);
}

export function transformHslToHex(color: HslColor) {
  return colord(color).toHex();
}

/**
 * Add color alpha
 *
 * @param color - Color
 * @param alpha - Alpha (0 - 1)
 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/**
 * Mix color
 *
 * @param firstColor - First color
 * @param secondColor - Second color
 * @param ratio - The ratio of the second color (0 - 1)
 */
export function mixColor(firstColor: AnyColor, secondColor: AnyColor, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/** 按 alpha 在原色与背景色之间做线性插值 */
function calRgb(or: number, bg: number, al: number) {
  return bg + (or - bg) * al;
}

/**
 * Transform color with opacity to similar color without opacity
 *
 * @param color - Color
 * @param alpha - Alpha (0 - 1)
 * @param bgColor Background color (usually white or black)
 */
export function transformColorWithOpacity(color: string, alpha: number, bgColor = '#ffffff') {
  const { b: oB, g: oG, r: oR } = colord(color).toRgb();

  const { b: bgB, g: bgG, r: bgR } = colord(bgColor).toRgb();

  const resultRgb: RgbColor = {
    b: calRgb(oB, bgB, alpha),
    g: calRgb(oG, bgG, alpha),
    r: calRgb(oR, bgR, alpha)
  };

  return colord(resultRgb).toHex();
}

/**
 * Is white color
 *
 * @param color - Color
 */
export function isWhiteColor(color: AnyColor) {
  return colord(color).isEqual('#ffffff');
}

/**
 * Adjust color lightness
 *
 * @param color - Color
 * @param amount - Amount to adjust (-100 to 100), positive = lighter, negative = darker
 */
export function adjustLightness(color: AnyColor, amount: number) {
  const c = colord(color);
  if (amount > 0) {
    return c.lighten(amount / 100).toHex();
  }
  return c.darken(Math.abs(amount) / 100).toHex();
}

/**
 * Lighten a color
 *
 * @param color - Color
 * @param amount - Amount to lighten (0 - 100)
 */
export function lightenColor(color: AnyColor, amount: number) {
  return colord(color)
    .lighten(amount / 100)
    .toHex();
}

/**
 * Darken a color
 *
 * @param color - Color
 * @param amount - Amount to darken (0 - 100)
 */
export function darkenColor(color: AnyColor, amount: number) {
  return colord(color)
    .darken(amount / 100)
    .toHex();
}

export { colord };
