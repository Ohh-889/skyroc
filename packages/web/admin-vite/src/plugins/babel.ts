import babel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';

type BabelPluginOptions = NonNullable<Parameters<typeof babel>[0]>;
type ReactCompilerPresetOptions = NonNullable<Parameters<typeof reactCompilerPreset>[0]>;

const JOTAI_PRESETS: NonNullable<BabelPluginOptions['presets']> = [
  ['jotai-babel/preset', { customAtomNames: ['atomWithPartial'] }]
];

export interface SetupAdminBabelPluginOptions extends Omit<BabelPluginOptions, 'presets'> {
  /** Jotai atom debug and refresh preset switch retained from the legacy admin Vite config. */
  jotai?: boolean;

  /** Additional Babel presets executed after the React Compiler preset. */
  presets?: BabelPluginOptions['presets'];

  /** React Compiler preset options, or false to disable the built-in compiler preset. */
  reactCompiler?: false | ReactCompilerPresetOptions;
}

export function setupAdminBabelPlugin(options: SetupAdminBabelPluginOptions = {}) {
  const { jotai = true, presets = [], reactCompiler, ...restOptions } = options;

  return babel({
    ...restOptions,
    presets: [
      ...(jotai ? JOTAI_PRESETS : []),
      ...presets,
      ...(reactCompiler === false ? [] : [reactCompilerPreset(reactCompiler)])
    ]
  });
}
