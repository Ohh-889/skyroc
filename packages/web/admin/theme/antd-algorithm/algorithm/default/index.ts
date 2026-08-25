import { mixColor } from '@skyroc/color';
import type { MapToken, PresetColorType, SeedToken } from 'antd/lib/theme/interface';
import { defaultPresetColors } from '../../seed';
import genColorMapToken, {
  FUNCTIONAL_SEMANTIC_CONFIG,
  genPaletteVars,
  genSemanticColors
} from '../../shared/genColorMapToken';
import genCommonMapToken from '../../shared/genCommonMapToken';
import genControlHeight from '../../shared/genControlHeight';
import { genFontMapToken } from '../../shared/genFontMapToken';
import { genSizeMapToken } from '../../shared/genSizeMapToken';
import { generateColorPalettes, generateNeutralColorPalettes } from './colors';

// Export generator functions for external use
export { generateColorPalettes, generateNeutralColorPalettes };

/**
 * Light mode theme algorithm
 *
 * Uses generateOklchPaletteAnchored algorithm to replace antd's default @ant-design/colors Generates more modern
 * design-compliant palettes
 *
 * Generated content: - Preset colors (blue, geekblue, etc.): palette vars only (blue-1 ... blue-10, blue-50 ...
 * blue-950) - Functional colors (colorPrimary, colorInfo, etc.): palette vars + semantic colors (colorPrimaryBg,
 * colorPrimaryHover, ...)
 */
export default function derivative(token: SeedToken): MapToken {
  const colorPalettes = Object.keys(defaultPresetColors)
    .map(colorKey => {
      const baseColor = token[colorKey as keyof PresetColorType];

      if (!baseColor) return {};

      const colors = generateColorPalettes(baseColor);
      const isFunctionalColor = colorKey.startsWith('color');

      // Preset colors: palette vars only, no semantic colors
      if (!isFunctionalColor) {
        return genPaletteVars(colorKey, colors);
      }

      // Functional colors: palette vars + semantic colors
      const result = genPaletteVars(colorKey, colors);

      const capitalizedKey = colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
      const semanticColors = genSemanticColors({
        colors,
        config: FUNCTIONAL_SEMANTIC_CONFIG,
        name: capitalizedKey
      });

      if (colorKey === 'colorError') {
        result.colorErrorBgActive = colors[3];
        result.colorErrorBgFilledHover = mixColor(colors[1], colors[3], 0.5);
      }
      Object.assign(result, semanticColors);

      return result;
    })
    .reduce<MapToken>((prev, cur) => {
      return { ...prev, ...cur };
    }, {} as MapToken);

  return {
    ...token,
    ...colorPalettes,
    ...genFontMapToken(token.fontSize),
    ...genSizeMapToken(token.sizeUnit),
    ...genControlHeight(token),
    ...genCommonMapToken(token),
    // Neutral color mapping (background, text, border, etc.)
    ...genColorMapToken(token, {
      generateNeutralColorPalettes
    })
  };
}
