import fg from 'fast-glob';
import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  clean: true,
  copy: [{ from: 'src/styles/theme.css', to: 'dist/styles' }],
  dts: true,
  entry: ['src/index.ts', ...fg.sync('src/components/**/index.ts')],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), 'react/jsx-runtime'],
  minify: false,
  platform: 'neutral',
  sourcemap: false,
  unbundle: true
});
