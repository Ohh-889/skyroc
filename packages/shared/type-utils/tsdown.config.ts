import { defineConfig } from 'tsdown';

/**
 * 本包零运行时，产物只有声明文件有意义（dist/_.js 与 dist/_.cjs 均为空文件）。
 *
 * 仍然同时输出 esm + cjs，是为了拿到配套的 `.d.ts` / `.d.cts`—— node16/nodenext 解析下 `import` 与 `require` 两种模式各自需要对应后缀的声明文件。
 */
export default defineConfig({
  clean: true,
  dts: {
    resolve: true
  },
  entry: ['src/index.ts', 'src/web/index.ts'],
  format: ['cjs', 'esm'],
  minify: false,
  platform: 'neutral',
  sourcemap: false
});
