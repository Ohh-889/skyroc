/**
 * CanvasKit 的两个文件都由 Turbopack 当 asset 处理（见 next.config.mjs 的 turbopack.rules）， import 拿到的是打包后的 URL
 * 字符串，而不是模块本身。canvaskit.js 自带类型声明， 不显式覆盖的话 TS 会按「初始化函数」去理解它，和运行时对不上。
 *
 * 这个文件必须保持「非模块」（不能出现顶层 import / export），否则里面的 declare module 会退化成模块内的局部声明，全局不可见 —— global.d.ts 就是这种情况，别把声明挪过去。
 */
declare module '*.wasm' {
  const url: string;
  export default url;
}

declare module 'canvaskit-wasm/bin/full/canvaskit.js' {
  const url: string;
  export default url;
}
