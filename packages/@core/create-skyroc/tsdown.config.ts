import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/index.ts'],
  external: Object.keys((pkg as { dependencies?: Record<string, string> }).dependencies ?? {}),
  minify: false,
  platform: 'node',
  shims: true,
  sourcemap: false,
  unbundle: false
});
