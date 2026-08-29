import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

const dependencies = (pkg as { dependencies?: Record<string, string> }).dependencies ?? {};

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: Object.keys(dependencies)
  },
  dts: true,
  entry: [
    'src/index.ts',
    'src/cn.ts',
    'src/crypto.ts',
    'src/path.ts',
    'src/scheduler/index.ts',
    'src/type/index.ts',
    'src/web/index.ts'
  ],
  minify: false,
  platform: 'neutral',
  sourcemap: false,
  tsconfig: 'tsconfig.web.json',
  unbundle: true
});
