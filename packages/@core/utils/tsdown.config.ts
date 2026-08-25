import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

const dependencies = (pkg as { dependencies?: Record<string, string> }).dependencies ?? {};

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/cn.ts', 'src/crypto.ts', 'src/path.ts', 'src/type/index.ts', 'src/web/index.ts'],
  external: Object.keys(dependencies),
  minify: false,
  platform: 'neutral',
  sourcemap: false,
  unbundle: true
});
