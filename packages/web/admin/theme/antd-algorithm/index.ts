// Dark theme algorithm
export { default as derivativeDark } from './algorithm/dark';
export {
  DARK_BG_BASE,
  DARK_TEXT_BASE,
  generateColorPalettes as generateDarkColorPalettes,
  generateNeutralColorPalettes as generateDarkNeutralColorPalettes
} from './algorithm/dark/colors';

// Default theme algorithm
export { default as derivative } from './algorithm/default';
export {
  generateColorPalettes,
  generateNeutralColorPalettes,
  LIGHT_BG_BASE,
  LIGHT_TEXT_BASE
} from './algorithm/default/colors';

// Seed tokens
export { defaultPresetColors, seedToken } from './seed';

// Color utilities (re-exported from @skyroc/color)
export { adjustLightness, darkenColor, lightenColor, mixColor } from './shared/colorAlgorithm';

// Color map token
export {
  ANTD_INDEXES,
  default as genColorMapToken,
  FUNCTIONAL_SEMANTIC_CONFIG,
  genPaletteVars,
  genSemanticColors,
  PRIMARY_SEMANTIC_CONFIG,
  TAILWIND_INDEXES
} from './shared/genColorMapToken';

export type { SemanticColorConfig } from './shared/genColorMapToken';

// Common map token
export { default as genCommonMapToken } from './shared/genCommonMapToken';

// Control height
export { default as genControlHeight } from './shared/genControlHeight';

// Font map token
export {
  default as genFontMapToken,
  FONT_SIZES,
  genFontSizes,
  getLineHeightRatio,
  LINE_HEIGHTS,
  remToPx
} from './shared/genFontMapToken';

export type { FontSizeKey } from './shared/genFontMapToken';

// Radius map token
export {
  calcRadius,
  default as genRadiusMapToken,
  genExtendedRadiusToken,
  genRadiusSizes,
  genRadiusVars,
  RADIUS_MULTIPLIERS
} from './shared/genRadiusMapToken';

export type { ExtendedRadiusToken, RadiusMapToken, RadiusSizeKey } from './shared/genRadiusMapToken';

// Size map token
export {
  calcSpacing,
  default as genSizeMapToken,
  genSpacingSizes,
  genSpacingVars,
  SPACING_MULTIPLIERS
} from './shared/genSizeMapToken';

export type { SpacingSizeKey } from './shared/genSizeMapToken';

// Types
export type * from './types';
