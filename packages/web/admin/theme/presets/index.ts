import azir from './azir.json';
import compact from './compact.json';
import dark from './dark.json';
import defaultPreset from './default.json';
import shadcn from './shadcn.json';

/** All available presets */
export const presets = {
  azir,
  compact,
  dark,
  default: defaultPreset,
  shadcn
} as const;

/** Preset names */
export type PresetName = keyof typeof presets;

/** Get preset by name */
export function getPreset(name: PresetName): Theme.ThemePreset {
  return presets[name] as Theme.ThemePreset;
}

/** Get all presets sorted by order */
export function getAllPresets(): Theme.ThemePreset[] {
  return Object.values(presets).toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0)) as Theme.ThemePreset[];
}

export { azir, compact, dark, defaultPreset, shadcn };
