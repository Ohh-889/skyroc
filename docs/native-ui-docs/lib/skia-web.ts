/**
 * Skia 在 web 上的运行时（CanvasKit wasm）加载入口。
 *
 * 原生端 Skia 的实现由 JSI 注入全局 `SkiaApi`，import 进来就能用；web 端不是： `@shopify/react-native-skia` 的 `Skia.web.ts` 在**模块求值那一刻**执行
 * `JsiSkApi(global.CanvasKit)`，把当时的全局 CanvasKit 一次性捕获进每个工厂对象。 wasm 还没加载时 `global.CanvasKit` 是 undefined，`Skia`
 * 依旧是个正常对象， 但工厂里握着的全是 undefined，直到 `Skia.Path.Make()` 才炸成 `Cannot read properties of undefined (reading 'Path')`。
 *
 * 所以这里是个硬时序：**任何 import 到 @shopify/react-native-skia 的模块， 都必须等 ensureSkiaWeb() resolve 之后才被求值**，事后再补加载是救不回来的。 预览本来就是动态
 * import，在 import demo 之前 await 一下即可。
 */

// 官方的 LoadSkiaWeb 直接 `import CanvasKitInit from "canvaskit-wasm/bin/full/canvaskit"`，
// 在 Turbopack 下走不通：那个 emscripten 胶水层里有 node 分支，打包器静态解析到
// require('fs') 就报 Module not found。改成按 asset 拿 URL、运行时插 <script> 标签，
// 让它彻底绕开模块图。两个 asset 规则见 next.config.mjs 的 turbopack.rules。
import canvasKitScriptUrl from 'canvaskit-wasm/bin/full/canvaskit.js';
import canvasKitWasmUrl from 'canvaskit-wasm/bin/full/canvaskit.wasm';

/** Canvaskit.js 作为普通脚本执行后挂在 window 上的初始化函数 */
type CanvasKitInit = (opts: { locateFile: (file: string) => string }) => Promise<unknown>;

declare global {
  // eslint-disable-next-line no-var -- 全局声明只能用 var
  var CanvasKit: unknown;
  // eslint-disable-next-line no-var -- 同上
  var CanvasKitInit: CanvasKitInit | undefined;
}

/** 用到 Skia 的组件 slug。CanvasKit 是 8MB 的 wasm，只有这些预览值得为它买单， 其余组件页不该被拖慢，所以不做无差别预加载。新增基于 Skia 的组件时补一条。 */
const SKIA_SLUGS = new Set(['signature']);

let loadingPromise: Promise<void> | undefined;

/** Demo 名形如 `signature/SignatureBasic`，整页预览的 slug 形如 `signature`，取首段即可 */
export function needsSkiaWeb(nameOrSlug: string) {
  return SKIA_SLUGS.has(nameOrSlug.split('/')[0]);
}

function loadCanvasKitScript() {
  return new Promise<void>((resolve, reject) => {
    if (globalThis.CanvasKitInit) {
      resolve();
      return;
    }

    const script = document.createElement('script');

    script.src = canvasKitScriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`加载 CanvasKit 失败：${canvasKitScriptUrl}`));
    document.head.append(script);
  });
}

/** 加载 CanvasKit 并挂到 `global.CanvasKit` 上 —— 这正是官方 LoadSkiaWeb 做的事， 也是 Skia.web.ts 唯一依赖的约定。并发调用共用同一个 promise。 */
export async function ensureSkiaWeb() {
  loadingPromise ??= (async () => {
    if (globalThis.CanvasKit !== undefined) return;

    await loadCanvasKitScript();

    const init = globalThis.CanvasKitInit;

    if (!init) throw new Error('CanvasKit 脚本已加载，但没有挂出 CanvasKitInit');

    // 脚本是运行时插进来的，emscripten 默认按 document.currentScript 推目录会拿到 null，
    // 所以 .wasm 的地址必须显式给出（asset 产物的文件名带 hash，也只能由打包器给）
    globalThis.CanvasKit = await init({ locateFile: () => canvasKitWasmUrl });
  })();

  return loadingPromise;
}
