export type Key = string | number;
export type PathTuple = readonly Key[];
export type NamePath = Key | PathTuple | undefined;

export type SetOptions = {
  /** Reject dangerous keys like "**proto**", "constructor", "prototype". Default: true (recommended) */
  safeKeys?: boolean;
};

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

export const isObjectRecord = (value: unknown): value is Record<Key, unknown> =>
  value !== null && typeof value === 'object';

export const isObjectLike = (value: unknown): value is Record<string | number, unknown> =>
  value !== null && typeof value === 'object';

export const isUnsafeKey = (key: Key) => key === '__proto__' || key === 'constructor' || key === 'prototype';

/**
 * 把段解析成合法的数组下标，不是下标则返回 null。
 *
 * 数字段和不带前导 0 的数字字符串都算下标 —— tuple 形式的路径（`['a', '0']`）不会经过 `toPathArray` 的数字转换，这里要兜住。
 */
export function toArrayIndex(key: Key): number | null {
  if (typeof key === 'number') return Number.isInteger(key) && key >= 0 ? key : null;

  return /^(0|[1-9]\d*)$/.test(key) ? Number(key) : null;
}

const PATH_RX = /[^.[\]]+|\[(?:([^"'[\]]+)|"([^"]*)"|'([^']*)')\]/g;

export function toPathArray(path: string): Key[] {
  const out: Key[] = [];

  // 用 matchAll 而不是拿 replace 当迭代器：后者要靠回调副作用收集结果，
  // 还得为四个捕获组各占一个形参。
  for (const match of path.matchAll(PATH_RX)) {
    const [whole, bare, doubleQuoted, singleQuoted] = match;

    // 保持 `||` 而非 `??`：空的引号段（`items[""]`）要回退到整段原文
    const seg = bare || doubleQuoted || singleQuoted || whole;

    out.push(/^(0|[1-9]\d*)$/.test(seg) ? Number(seg) : seg);
  }

  return out;
}

/**
 * 把任意 NamePath 归一成段数组。
 *
 * `undefined` 表示「没有路径」，必须归一成空数组 —— 否则下游会拿到 `[undefined]` 这一段， 在 deepSet 里写出字面量 `"undefined"` 键。
 */
export function toSegments(path: NamePath): Key[] {
  if (path === undefined) return [];

  if (Array.isArray(path)) return [...path];

  if (typeof path === 'string') return toPathArray(path);

  return [path as Key];
}

export const keyOfTuple = (tuple: PathTuple) => tuple.join('.');

export const keyOfName = (name: NamePath) => keyOfTuple(toSegments(name));

export function emptyContainer(nextKey: Key): any {
  return typeof nextKey === 'number' ? [] : {};
}

/** `key` 是否等于 `prefix` 或位于 `prefix` 之下（`''` 与 `'*'` 匹配一切） */
export const isUnderPrefix = (key: string, prefix: string): boolean => {
  if (prefix === '' || prefix === '*') return true;

  if (key === prefix) return true;

  return key.length > prefix.length && key.startsWith(prefix) && key[prefix.length] === '.';
};

/** 递归收集对象的全部叶子路径（点号形式），Date 与空对象按叶子处理 */
export function collectDeepKeys(obj: any, prefix: string = ''): string[] {
  if (obj === null || obj === undefined) {
    return [prefix];
  }

  if (typeof obj !== 'object' || obj instanceof Date) {
    return [prefix];
  }

  const keys: string[] = [];

  if (Object.keys(obj).length === 0) {
    keys.push(prefix);
    return keys;
  }

  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    keys.push(...collectDeepKeys(obj[key], path));
  }

  return keys;
}
