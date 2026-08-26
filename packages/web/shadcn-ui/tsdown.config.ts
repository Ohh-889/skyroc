import fg from 'fast-glob';
import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  alias: {
    '@': './src'
  },
  clean: true,
  dts: true,
  entry: [
    'src/index.ts',
    ...fg.sync('src/components/**/index.{ts,tsx}'),
    ...fg.sync('src/preset/**/index.ts'),
    'src/hooks/index.ts'
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), 'react/jsx-runtime'],
  hooks: {
    'build:before': () => {},
    'build:done': () => {}
  },
  minify: false,
  platform: 'neutral',
  sourcemap: false,
  unbundle: true
});
