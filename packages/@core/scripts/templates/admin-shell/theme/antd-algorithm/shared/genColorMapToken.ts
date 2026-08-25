import type { ColorMapToken, SeedToken } from 'antd/lib/theme/interface';
import type { ColorMap, PaletteGenerators } from '../types';

/** AntD 1-10 indexes */
export const ANTD_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/** Tailwind style 50-950 indexes */
export const TAILWIND_INDEXES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/**
 * Semantic color mapping configuration
 *
 * Design principles: - 1-2 (50-100): Background - 3-4 (200-300): Border - 5 (400): Hover - 6 (500): Main color - 7
 * (600): Active - 5-7 (400-600): Text related
 */
export interface SemanticColorConfig {
  /** Active color */
  active: number;
  /** Background color */
  bg: number;
  /** Background hover color */
  bgHover: number;
  /** Border color */
  border: number;
  /** Border hover color */
  borderHover: number;
  /** Hover color */
  hover: number;
  /** Main color */
  main: number;
  /** Text color */
  text: number;
  /** Text active color */
  textActive: number;
  /** Text hover color */
  textHover: number;
}

/** Primary color semantic configuration */
export const PRIMARY_SEMANTIC_CONFIG: SemanticColorConfig = {
  active: 7,
  bg: 1,
  bgHover: 2,
  border: 3,
  borderHover: 4,
  hover: 5,
  main: 6,
  text: 6,
  textActive: 7,
  textHover: 5
};

/** Functional color semantic configuration (success, warning, error, info) */
export const FUNCTIONAL_SEMANTIC_CONFIG: SemanticColorConfig = {
  active: 7,
  bg: 1,
  bgHover: 2,
  border: 3,
  borderHover: 4,
  hover: 4, // Functional color uses 4 for hover
  main: 6,
  text: 9,
  textActive: 10,
  textHover: 8
};

interface GenSemanticColorsOptions {
  colors: ColorMap;
  config: SemanticColorConfig;
  /** Color name, supports 'colorPrimary' or 'Primary' format */
  name: string;
}

/** Normalize color name - 'colorPrimary' → 'Primary' - 'Primary' → 'Primary' - 'primary' → 'Primary' */
function normalizeColorName(name: string): string {
  // Remove 'color' prefix
  let normalized = name.startsWith('color') ? name.slice(5) : name;
  // First letter lowercase
  normalized = normalized.charAt(0).toLocaleLowerCase() + normalized.slice(1);
  return normalized;
}

/**
 * Generate semantic colors for a single color
 *
 * @example
 *   // The following three calls are equivalent:
 *   genSemanticColors({ name: 'colorPrimary', ... })
 *   genSemanticColors({ name: 'Primary', ... })
 *   genSemanticColors({ name: 'primary', ... })
 *   // All generate: colorPrimary, colorPrimaryActive, colorPrimaryBg, ...
 */
export function genSemanticColors({ colors, config, name }: GenSemanticColorsOptions): Record<string, string> {
  let colorName = name;
  const isMainColor = name.startsWith('Color');
  if (isMainColor) {
    colorName = name.slice(5);
  }

  const extra = isMainColor
    ? { [colorName.charAt(0).toLocaleLowerCase() + colorName.slice(1)]: colors[config.main] }
    : {};
  return {
    ...extra,
    [`color${colorName}`]: colors[config.main],
    [`color${colorName}Active`]: colors[config.active],
    [`color${colorName}Bg`]: colors[config.bg],
    [`color${colorName}BgHover`]: colors[config.bgHover],
    [`color${colorName}Border`]: colors[config.border],
    [`color${colorName}BorderHover`]: colors[config.borderHover],
    [`color${colorName}Hover`]: colors[config.hover],
    [`color${colorName}Text`]: colors[config.text],
    [`color${colorName}TextActive`]: colors[config.textActive],
    [`color${colorName}TextHover`]: colors[config.textHover]
  } as Record<string, string>;
}

/**
 * Generate palette variables (1-10 and 50-950).
 *
 * AntD components read compact keys such as `blue1`, while UnoCSS and project styles use hyphenated keys such as
 * `blue-1`. Both aliases must point to the same palette value.
 */
export function genPaletteVars(name: string, colors: ColorMap): Record<string, string> {
  const colorName = normalizeColorName(name);

  const result: Record<string, string> = {};

  // AntD internal format: name1 to name10; project palette format: name-1 to name-10.
  for (const i of ANTD_INDEXES) {
    const color = colors[i] || '';
    result[`${colorName}${i}`] = color;
    result[`${colorName}-${i}`] = color;
  }

  // Tailwind format: name-50 to name-950
  for (const i of TAILWIND_INDEXES) {
    result[`${colorName}-${i}`] = colors[i] || '';
  }

  return result;
}

/**
 * Generate neutral color map token
 *
 * Only generates neutral colors (background, text, border, etc.) Theme colors are generated in the derivative function
 * by iterating defaultPresetColors
 */
export default function genColorMapToken(
  seed: SeedToken,
  { generateNeutralColorPalettes }: PaletteGenerators
): ColorMapToken {
  const { colorBgBase, colorTextBase } = seed;

  // Generate neutral colors
  const neutralColors = generateNeutralColorPalettes(colorBgBase, colorTextBase);

  return {
    ...neutralColors,
    // Mask and white
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    colorWhite: '#fff'
  } as ColorMapToken;
}
