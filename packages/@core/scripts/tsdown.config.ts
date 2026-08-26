import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

const external = Object.keys((pkg as { dependencies?: Record<string, string> }).dependencies ?? {});

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/index.ts', 'src/cli.ts'],
  external,
  minify: false,
  platform: 'node',
  shims: true,
  sourcemap: false,
  unbundle: false
});
