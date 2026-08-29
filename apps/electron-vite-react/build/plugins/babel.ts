import { createRequire } from 'node:module';
import babel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import type jotaiPresetType from 'jotai-babel/preset';

type BabelPluginOptions = NonNullable<Parameters<typeof babel>[0]>;

const require = createRequire(import.meta.url);
const jotaiPreset = (require('jotai-babel/preset') as { default: typeof jotaiPresetType }).default;

const JOTAI_PRESETS: NonNullable<BabelPluginOptions['presets']> = [
  [jotaiPreset, { customAtomNames: ['atomWithPartial'] }]
];

export function setupBabelPlugin() {
  return babel({
    presets: [...JOTAI_PRESETS, reactCompilerPreset()]
  });
}
