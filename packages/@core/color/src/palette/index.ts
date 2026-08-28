import type { AnyColor } from 'colord';
import { getHex } from '../shared';
import type { ColorPaletteNumber, PaletteAlgorithm } from '../types';
import { getAntDColorPalette } from './antd';
import { generateOklchPalette } from './oklch';
import { getRecommendedColorPaletteFamily } from './recommend';

export * from './antd';
export * from './oklch';
export * from './recommend';

/** 统一入口的完整配置 */
export interface ColorPaletteOptions {
  /**
   * The palette generation algorithm
   *
   * @default 'antd'
   */
  algorithm?: PaletteAlgorithm;
  /**
   * 生成暗色主题色板（仅 `antd` 算法生效）
   *
   * @default false
   */
  darkTheme?: boolean;
  /**
   * 暗色主题的混合基色（仅 `antd` 算法生效）
   *
   * @default '#141414'
   */
  darkThemeMixColor?: string;
}

/** 统一入口的第二参：直接给算法名，或给完整配置 */
export type ColorPaletteConfig = ColorPaletteOptions | PaletteAlgorithm;

/** Antd 算法的 11 档索引与 Tailwind 档位号的对应关系 */
const PALETTE_NUMBERS: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** 把「算法名或配置对象」归一为配置对象 */
function normalizeConfig(config: ColorPaletteConfig): ColorPaletteOptions {
  return typeof config === 'string' ? { algorithm: config } : config;
}

/**
 * Get color palette by provided color
 *
 * @param color Any valid color value
 * @param config 算法名（默认 `'antd'`），或包含算法与暗色选项的配置对象
 */
export function getColorPalette(color: AnyColor, config: ColorPaletteConfig = 'antd') {
  const { algorithm = 'antd', darkTheme = false, darkThemeMixColor } = normalizeConfig(config);

  const colorMap = new Map<ColorPaletteNumber, string>();

  // recommended / oklch 只接受字符串，需要先归一化；
  // antd 算法直接吃 AnyColor，且返回值本身就是 getHex 的产物，
  // 这里若多转一次 hex 会把 `hsl(...)` 之类高精度输入截断到 8bit，导致派生档位偏移 1-2。
  if (algorithm === 'recommended') {
    getRecommendedColorPaletteFamily(getHex(color)).palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });

    return colorMap;
  }

  if (algorithm === 'oklch') {
    generateOklchPalette(getHex(color)).palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });

    return colorMap;
  }

  const colors = getAntDColorPalette(color, darkTheme, darkThemeMixColor);

  PALETTE_NUMBERS.forEach((number, index) => {
    colorMap.set(number, colors[index]);
  });

  return colorMap;
}

/**
 * Get color palette color by number
 *
 * @param color The provided color
 * @param number The color palette number
 * @param config 算法名（默认 `'antd'`），或包含算法与暗色选项的配置对象
 */
export function getPaletteColorByNumber(
  color: AnyColor,
  number: ColorPaletteNumber,
  config: ColorPaletteConfig = 'antd'
) {
  return getColorPalette(color, config).get(number)!;
}
