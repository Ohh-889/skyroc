import { adjustLightness, generateDarkModePalette, mixColor } from '@skyroc/color';
import type { ColorMap, GenerateColorMap, GenerateNeutralColorMap } from '../../types';

/** Dark mode default base colors */
export const DARK_BG_BASE = '#000';
export const DARK_TEXT_BASE = '#FFFFFF';

/**
 * Generate color palettes (dark mode)
 *
 * Uses a dark-mode OKLCH palette anchored at 500 so the user-provided theme color remains the semantic main color. The
 * palette mapping follows Ant Design's dark-mode interaction rules.
 *
 * 档位号语义与亮色一致——50 最亮、950 最暗。暗色主题需要深色背景，因此 antd 的 1-4 档取的是色板暗端（950-700），而不是靠翻转档位号来实现。
 *
 * Mapping strategy (reference antd dark theme): - 1-4: 取暗端 (950-700)，用于背景与边框 - 5-7: 交叉映射中间亮区 (5→400, 6→500,
 * 7→600)，增强交互对比 - 8-10: 复用 5-7 (8→400, 9→500, 10→600)，用于文字色
 */
export const generateColorPalettes: GenerateColorMap = (baseColor: string): ColorMap => {
  const { palettes } = generateDarkModePalette(baseColor, 500);
  const [p50, p100, p200, p300, p400, p500, p600, p700, p800, p900, p950] = palettes;

  return {
    // antd 1-10 format (dark mode special mapping, reference antd official implementation)
    1: p950.hex, // 950 - darkest background
    2: p900.hex, // 900 - background hover
    3: p800.hex, // 800 - border
    4: p700.hex, // 700 - border hover
    5: p400.hex, // 400 - hover color (dark mode needs brighter)
    6: p500.hex, // 500 - main color
    7: p600.hex, // 600 - active color
    8: p400.hex, // 400 - text hover
    9: p500.hex, // 500 - text color
    10: p600.hex, // 600 - text active
    // Tailwind 50-950 format (keep original mapping)
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
 * Generate neutral color palettes (dark mode)
 *
 * Reference Ant Design official dark theme implementation: - Uses solid color mixing algorithm (not transparency) -
 * Background levels: Layout(base) → Container(+8) → Elevated(+12) - Text transparency: 85% / 65% / 45% / 25% - Fill
 * transparency: 18% / 12% / 8% / 4% - Border uses fixed lightness increase (26 / 19)
 *
 * Base colors: - colorBgBase: #141414 (Ant Design dark background) - colorTextBase: #FFFFFF (pure white)
 */
export const generateNeutralColorPalettes: GenerateNeutralColorMap = (bgBaseColor: string, textBaseColor: string) => {
  const colorBgBase = bgBaseColor || DARK_BG_BASE;
  const colorTextBase = textBaseColor || DARK_TEXT_BASE;

  return {
    colorBgBase,
    colorTextBase,

    /** Text color levels Reference antd: Uses mixing algorithm to simulate transparency effect 85% / 65% / 45% / 25% */
    colorText: mixColor(colorBgBase, colorTextBase, 0.85), // Primary text
    colorTextSecondary: mixColor(colorBgBase, colorTextBase, 0.65), // Secondary text
    colorTextTertiary: mixColor(colorBgBase, colorTextBase, 0.45), // Placeholder, disabled
    colorTextQuaternary: mixColor(colorBgBase, colorTextBase, 0.25), // Very weak text

    /** Fill color levels Reference antd: 18% / 12% / 8% / 4% For button hover, selected background, etc. */
    colorFill: mixColor(colorBgBase, colorTextBase, 0.18), // Primary fill
    colorFillSecondary: mixColor(colorBgBase, colorTextBase, 0.12), // Secondary fill
    colorFillTertiary: mixColor(colorBgBase, colorTextBase, 0.08), // Divider background
    colorFillQuaternary: mixColor(colorBgBase, colorTextBase, 0.04), // Weak fill

    /** Solid background Reference antd: 95% / 100% / 90% For dark buttons, badges, etc. */
    colorBgSolid: mixColor(colorBgBase, colorTextBase, 0.95), // Solid background
    colorBgSolidHover: colorTextBase, // Solid hover (pure white)
    colorBgSolidActive: mixColor(colorBgBase, colorTextBase, 0.9), // Solid active

    /**
     * Background levels Reference antd: Layout(0) → Container(8) → Elevated(12) Dark mode floating layers need to be
     * brighter to show hierarchy
     */
    colorBgLayout: colorBgBase, // Page background (base color)
    colorBgContainer: adjustLightness(colorBgBase, 8), // Card, container background (+8)
    colorBgElevated: adjustLightness(colorBgBase, 12), // Popup, dropdown (+12)
    colorBgSpotlight: adjustLightness(colorBgBase, 26), // Spotlight focus (+26)
    colorBgBlur: mixColor(colorBgBase, colorTextBase, 0.04), // Blur background (4%)

    /** Border colors Reference antd: Fixed lightness increase 26 / 26 / 19 */
    colorBorder: adjustLightness(colorBgBase, 26), // Primary border
    colorBorderDisabled: adjustLightness(colorBgBase, 26), // Disabled border (same as primary)
    colorBorderSecondary: adjustLightness(colorBgBase, 19) // Secondary border, divider
  };
};
