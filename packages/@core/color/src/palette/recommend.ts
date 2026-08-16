import { colorPalettes } from '../constant';
import { getColorName, getDeltaE, getHex, getHsl, isValidColor, transformHslToHex } from '../shared';
import type {
  ColorPalette,
  ColorPaletteFamily,
  ColorPaletteFamilyWithNearestPalette,
  ColorPaletteMatch,
  ColorPaletteNumber
} from '../types';

/** 推荐算法的内部生成结果，额外携带输入色落在哪一档 */
type RecommendedFamilyResult = {
  family: ColorPaletteFamily;
  /** 输入色被放置的档位号 */
  matchedNumber: ColorPaletteNumber;
};

/**
 * Get recommended color palette by provided color
 *
 * @param color The provided color
 */
export function getRecommendedColorPalette(color: string) {
  const { family, matchedNumber } = buildRecommendedColorPaletteFamily(color);

  const colorMap = new Map<ColorPaletteNumber, ColorPalette>();

  family.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  const colorPalette: ColorPaletteMatch = {
    ...family,
    colorMap,
    main: colorMap.get(500)!,
    match: colorMap.get(matchedNumber)!
  };

  return colorPalette;
}

/**
 * Get recommended palette color by provided color
 *
 * @param color The provided color
 * @param number The color palette number
 */
export function getRecommendedPaletteColorByNumber(color: string, number: ColorPaletteNumber) {
  const { family } = buildRecommendedColorPaletteFamily(color);

  return family.palettes.find(palette => palette.number === number)!.hex;
}

/**
 * Get color palette family by provided color and color name
 *
 * @param color The provided color
 */
export function getRecommendedColorPaletteFamily(color: string): ColorPaletteFamily {
  return buildRecommendedColorPaletteFamily(color).family;
}

/**
 * 生成推荐色板，并回传输入色所在的档位
 *
 * 输入色统一归一化为小写 hex 后再写入色板，避免把 `rgb(...)`、`red`、大写 hex 之类的原始字符串泄漏进 `hex` 字段。
 *
 * @param color The provided color
 */
function buildRecommendedColorPaletteFamily(color: string): RecommendedFamilyResult {
  if (!isValidColor(color)) {
    throw new Error('Invalid color, please check color value!');
  }

  const inputHex = getHex(color);

  const colorName = getColorName(inputHex).toLowerCase().replace(/\s/g, '-');

  const { h: inputH, s: inputS } = getHsl(inputHex);

  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(inputHex, colorPalettes);

  const { hex: nearestHex, number: matchedNumber } = nearestLightnessPalette;

  const { h: nearestH, s: nearestS } = getHsl(nearestHex);

  const deltaH = inputH - nearestH;

  const sRatio = inputS / nearestS;

  const family: ColorPaletteFamily = {
    name: colorName,
    palettes: palettes.map(palette => {
      if (palette.number === matchedNumber) {
        return { hex: inputHex, number: palette.number };
      }

      const { h, l, s } = getHsl(palette.hex);

      const newH = deltaH < 0 ? h + deltaH : h - deltaH;
      const newS = s * sRatio;

      return {
        hex: transformHslToHex({ h: newH, l, s: newS }),
        number: palette.number
      };
    })
  };

  return { family, matchedNumber };
}

/**
 * Get nearest color palette family
 *
 * @param color Color
 * @param families Color palette families
 */
function getNearestColorPaletteFamily(color: string, families: ColorPaletteFamily[]) {
  const familyWithConfig = families.map(family => {
    const palettes = family.palettes.map(palette => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hex)
      };
    });

    const nearestPalette = palettes.reduce((prev, curr) => (prev.delta < curr.delta ? prev : curr));

    return {
      ...family,
      nearestPalette,
      palettes
    };
  });

  const nearestPaletteFamily = familyWithConfig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr
  );

  const { l } = getHsl(color);

  const paletteFamily: ColorPaletteFamilyWithNearestPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce((prev, curr) => {
      const { l: prevLightness } = getHsl(prev.hex);
      const { l: currLightness } = getHsl(curr.hex);

      const deltaPrev = Math.abs(prevLightness - l);
      const deltaCurr = Math.abs(currLightness - l);

      return deltaPrev < deltaCurr ? prev : curr;
    })
  };

  return paletteFamily;
}
