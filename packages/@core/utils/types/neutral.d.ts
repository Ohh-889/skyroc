/**
 * 平台无关入口的环境声明。
 *
 * 主入口所属的 TS 项目只加载 `lib: ["ESNext"]`，没有 DOM 也没有 @types/node —— 这是刻意的：任何对宿主全局的依赖都必须在编译期暴露出来，而不是等到 React Native 或 SSR
 * 运行时才炸。
 *
 * 这里只补声明「Node / 浏览器 / Hermes 三端都存在」的那一小撮全局。 需要新增条目时请先自问：RN 里真的有吗？
 *
 * 本文件只被 `tsconfig.json`（中立项目）包含，`tsconfig.web.json` 不包含它， 避免与 lib.dom 的同名声明冲突。
 */

declare const console: {
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
};

/** 定时器。三端都有，但句柄类型各不相同（浏览器是 number，Node 是 Timeout 对象）， 因此声明成不透明类型，调用方一律用 `ReturnType<typeof setTimeout>` 承接。 */
declare function setTimeout(handler: () => void, timeout?: number): { readonly __timer: unique symbol };
declare function clearTimeout(handle: ReturnType<typeof setTimeout> | undefined): void;
declare function setInterval(handler: () => void, timeout?: number): { readonly __interval: unique symbol };
declare function clearInterval(handle: ReturnType<typeof setInterval> | null | undefined): void;

/** 取消信号。Node ≥ 15、现代浏览器与 React Native 均内置。 */
interface AbortSignal {
  readonly aborted: boolean;
  addEventListener: (type: 'abort', listener: () => void) => void;
  readonly reason: unknown;
  removeEventListener: (type: 'abort', listener: () => void) => void;
  throwIfAborted: () => void;
}

declare class AbortController {
  readonly signal: AbortSignal;

  abort(reason?: unknown): void;
}
