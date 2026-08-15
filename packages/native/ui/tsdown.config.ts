import path from 'node:path';
import fg from 'fast-glob';
import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

/**
 * 存在 `.native` 变体的模块（如 `Pager.tsx` + `Pager.native.tsx`）。
 *
 * 这类模块的选择权在打包器手上：源码只写 `./Pager`，由 Metro 按平台后缀择优。 要让它在 dist 里同样生效，必须同时满足两个条件：
 *
 * 1. 两个变体都得是 entry —— `.native.tsx` 从入口图上不可达，否则会被直接丢弃；
 * 2. 引用方的相对说明符必须保持无扩展名 —— Metro 0.84 的 `resolveSourceFile` 会先做一次精确路径匹配（不带 platform，也跳过 `.native`），一旦产物里写成 `./Pager.js`
 *    就会命中 web 变体，`.native.js` 永远没有机会。
 *
 * 所以这里把基础变体标记为 external，阻止 rolldown 把它改写成带扩展名的 chunk 名。
 */
const platformSplitEntries = fg.sync('src/**/*.native.{ts,tsx}');

const platformSplitBaseIds = new Set(
  platformSplitEntries.map(file => path.resolve(file.replace(/\.native\.tsx?$/, '')))
);

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/index.ts',
    ...fg.sync('src/components/**/index.ts'),
    ...platformSplitEntries,
    ...platformSplitEntries.map(file => file.replace(/\.native\.(tsx?)$/, '.$1'))
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {}), 'react/jsx-runtime'],
  minify: false,
  platform: 'neutral',
  plugins: [
    {
      name: 'preserve-platform-specifiers',
      resolveId(source: string, importer: string | undefined) {
        if (!importer || !source.startsWith('.')) return null;

        const resolved = path.resolve(path.dirname(importer), source);

        if (!platformSplitBaseIds.has(resolved)) return null;

        return { external: true, id: source };
      }
    }
  ],
  sourcemap: false,
  unbundle: true
});
