import { mixColor } from '@skyroc/color';
import type { MapToken, PresetColorType, SeedToken } from 'antd/lib/theme/interface';
import { defaultPresetColors } from '../../seed';
import genColorMapToken, {
  FUNCTIONAL_SEMANTIC_CONFIG,
  genPaletteVars,
  genSemanticColors
} from '../../shared/genColorMapToken';
import defaultAlgorithm from '../default';
import { generateColorPalettes, generateNeutralColorPalettes } from './colors';

// Export generator functions for external use
export { generateColorPalettes, generateNeutralColorPalettes };

/**
 * Dark mode theme algorithm
 *
 * Reference Ant Design official dark theme implementation: 1. Uses generateDarkModePalette algorithm to generate
 * palettes (replaces @ant-design/colors) 2. Special color mapping strategy (1-4→950-700, 5→400, 6→500, 7→600) 3. Custom
 * colorPrimaryBg to optimize selected item background
 *
 * Generated content: - Preset colors (blue, geekblue, etc.): palette vars only (blue-1 ... blue-10, blue-50 ...
 * blue-950) - Functional colors (colorPrimary, colorInfo, etc.): palette vars + semantic colors (colorPrimaryBg,
 * colorPrimaryHover, ...) - Neutral color system: colorText, colorBgContainer, colorBorder, etc.
 */
export default function derivativeDark(token: SeedToken, mapToken?: MapToken): MapToken {
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

  // Generate neutral color mapping (background, text, border, etc.)
  const colorMapToken = genColorMapToken(token, {
    generateNeutralColorPalettes
  });

  const mergedMapToken = mapToken ?? defaultAlgorithm(token);

  return {
    ...mergedMapToken,
    ...colorPalettes,

    // Neutral color mapping
    ...colorMapToken,

    /**
     * Dark mode special customization Reference Ant Design official implementation:
     * https://github.com/ant-design/ant-design/issues/30524#issuecomment-871961867
     *
     * Uses colorPrimaryBorder as selected item background for better visual feedback
     */
    colorPrimaryBg: colorMapToken.colorPrimaryBorder,
    colorPrimaryBgHover: colorMapToken.colorPrimaryBorderHover
  };
}
