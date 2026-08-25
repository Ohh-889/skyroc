import type { ColorNeutralMapToken } from 'antd/lib/theme/interface';

// Re-export antd types for convenience
export type { ColorMapToken, ColorNeutralMapToken, MapToken, SeedToken } from 'antd/lib/theme/interface';

/** Color palette mapping (1-10 and 50-950 indexes) antd uses 1-10 indexes, Tailwind uses 50-950 indexes */
export interface ColorMap {
  [key: number]: string;
}

/** Color palette generator function type */
export type GenerateColorMap = (baseColor: string) => ColorMap;

/** Neutral color generator function type */
export type GenerateNeutralColorMap = (bgBaseColor: string, textBaseColor: string) => ColorNeutralMapToken;

/** Palette generators configuration */
export interface PaletteGenerators {
  generateNeutralColorPalettes: GenerateNeutralColorMap;
}
