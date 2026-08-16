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

/** antd 算法的 11 档索引与 Tailwind 档位号的对应关系 */
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

  const hex = getHex(color);

  if (algorithm === 'recommended') {
    getRecommendedColorPaletteFamily(hex).palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });

    return colorMap;
  }

  if (algorithm === 'oklch') {
    generateOklchPalette(hex).palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });

    return colorMap;
  }

  const colors = getAntDColorPalette(hex, darkTheme, darkThemeMixColor);

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
