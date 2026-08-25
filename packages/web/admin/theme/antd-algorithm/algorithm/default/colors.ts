import { adjustLightness, generateOklchPaletteAnchored, mixColor } from '@skyroc/color';
import type { ColorMap, GenerateColorMap, GenerateNeutralColorMap } from '../../types';

/** Light mode default base colors */
export const LIGHT_BG_BASE = '#FFFFFF';
export const LIGHT_TEXT_BASE = '#1F1F1F';

/**
 * Generate color palettes (light mode)
 *
 * Uses generateOklchPaletteAnchored algorithm instead of antd's @ant-design/colors Outputs 11 colors (50-950), mapped to
 * antd's 1-10 indexes
 */
export const generateColorPalettes: GenerateColorMap = (baseColor: string): ColorMap => {
  const { palettes } = generateOklchPaletteAnchored(baseColor);
  const [p50, p100, p200, p300, p400, p500, p600, p700, p800, p900, p950] = palettes;

  return {
    1: p50.hex, // 50 - lightest background
    2: p100.hex, // 100 - background hover
    3: p200.hex, // 200 - border
    4: p300.hex, // 300 - border hover
    5: p400.hex, // 400 - hover color
    6: p500.hex, // 500 - main color
    7: p600.hex, // 600 - active color
    8: p700.hex, // 700 - text hover
    9: p800.hex, // 800 - text color
    10: p900.hex, // 900 - text active
    50: p50.hex,
    100: p100.hex,
    200: p200.hex,
    300: p300.hex,
    400: p400.hex,
    500: p500.hex,
    600: p600.hex,
    700: p700.hex,
    800: p800.hex,
    900: p900.hex,
    950: p950.hex
  };
};

/**
 * Generate neutral color palettes (light mode)
 *
 * Uses solid color mixing algorithm instead of transparency Advantages: - Stable and predictable colors, not affected
 * by background - Precise contrast control - Consistent with theme palette algorithm
 *
 * Base colors: - colorBgBase: #FAFAFA (soft white) - colorTextBase: #1F1F1F (dark gray)
 */
export const generateNeutralColorPalettes: GenerateNeutralColorMap = (bgBaseColor: string, textBaseColor: string) => {
  const colorBgBase = bgBaseColor || LIGHT_BG_BASE;
  const colorTextBase = textBaseColor || LIGHT_TEXT_BASE;

  return {
    colorBgBase,
    colorTextBase,

    /**
     * Text color levels Uses bgBase and textBase mixing to generate solid colors Higher ratio = closer to textBase
     * (darker)
     */
    colorText: mixColor(colorBgBase, colorTextBase, 0.88), // Primary text
    colorTextSecondary: mixColor(colorBgBase, colorTextBase, 0.65), // Secondary text
    colorTextTertiary: mixColor(colorBgBase, colorTextBase, 0.45), // Placeholder, disabled
    colorTextQuaternary: mixColor(colorBgBase, colorTextBase, 0.25), // Very weak text

    /** Fill color levels For button hover, selected background, etc. */
    colorFill: mixColor(colorBgBase, colorTextBase, 0.12), // Primary fill
    colorFillSecondary: mixColor(colorBgBase, colorTextBase, 0.06), // Secondary fill
    colorFillTertiary: mixColor(colorBgBase, colorTextBase, 0.04), // Divider background
    colorFillQuaternary: mixColor(colorBgBase, colorTextBase, 0.02), // Weak fill

    /** Solid background For dark buttons, badges, etc. */
    colorBgSolid: colorTextBase, // Solid background
    colorBgSolidHover: mixColor(colorTextBase, colorBgBase, 0.15), // Solid hover (lighter)
    colorBgSolidActive: mixColor(colorTextBase, '#000000', 0.1), // Solid active (darker)

    /** Background levels Layout(dark) → Container → Elevated(light) */
    colorBgLayout: adjustLightness(colorBgBase, -3), // Page background (darker)
    colorBgContainer: colorBgBase, // Card, container background
    colorBgElevated: adjustLightness(colorBgBase, 2), // Popup, dropdown (lighter)
    colorBgSpotlight: mixColor(colorBgBase, colorTextBase, 0.85), // Spotlight focus
    colorBgBlur: 'transparent', // Blur background

    /** Border colors */
    colorBorder: mixColor(colorBgBase, colorTextBase, 0.15), // Primary border
    colorBorderDisabled: mixColor(colorBgBase, colorTextBase, 0.1), // Disabled border
    colorBorderSecondary: mixColor(colorBgBase, colorTextBase, 0.06) // Secondary border, divider
  };
};
