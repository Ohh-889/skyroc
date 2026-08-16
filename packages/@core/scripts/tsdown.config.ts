import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

const pkgJson = pkg as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };

/**
 * devDependencies 也要 external。
 *
 * `@tanstack/router-generator` 只被仓库内部的 sync-admin-template 用到，不该让所有安装了本包的用户背上它；但它一旦被打进
 * bundle，「不是 dependency」这件事就只是账面上的了。
 */
const external = [...Object.keys(pkgJson.dependencies ?? {}), ...Object.keys(pkgJson.devDependencies ?? {})];

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
