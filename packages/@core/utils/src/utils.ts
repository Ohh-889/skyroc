/** - No operation */
export function noop() {}

/** - Check if the value is null or undefined */
export function isNil(val: unknown): val is null | undefined {
  return val === null || val === undefined;
}

/**
 * 检查传入的字符串是否为有效的 HTTP 或 HTTPS URL。
 *
 * @param url 要检查的字符串。
 * @returns 如果字符串以 http:// 或 https:// 开头，返回 true。
 */
export function isHttpUrl(url?: string): boolean {
  if (!url) {
    return false;
  }

  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}

/** 过滤掉对象里值为 `undefined` 的字段（浅层） */
export function omitUndefined<T extends object>(obj: T) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

type MicrotaskFn = (cb: () => void) => void;

const nativeQueueMicrotask = (globalThis as { queueMicrotask?: MicrotaskFn }).queueMicrotask;

/**
 * 把回调排到微任务队列。
 *
 * 优先用宿主的 `queueMicrotask`（Node ≥ 11 / 浏览器 / Hermes 都有）， 缺失时回退到 `Promise.resolve().then`。 通过 `globalThis`
 * 取而不是直接引用全局标识符，是为了让本文件在不加载 DOM / Node 类型的情况下也能通过编译 —— 主入口必须保持平台无关。
 */
export const microtask: MicrotaskFn = nativeQueueMicrotask
  ? cb => nativeQueueMicrotask.call(globalThis, cb)
  : cb => {
      Promise.resolve().then(cb, noop);
    };
