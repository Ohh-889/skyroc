import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: Object.keys(pkg.dependencies || {})
  },
  dts: true,
  entry: ['src/index.ts', 'src/crypto/index.ts', 'src/query/index.ts'],
  minify: false,
  platform: 'neutral',
  sourcemap: false,
  unbundle: false
});
