import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/vitest/index.ts'],
  deps: {
    dts: {
      neverBundle: ['vitest/node']
    }
  },
  format: 'esm',
  outDir: 'dist',
  sourcemap: false
});
