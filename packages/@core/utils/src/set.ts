// oxlint-disable no-continue
import type { Key, NamePath, SetOptions } from './path-utils';
import { emptyContainer, isObjectLike, isPlainObject, isUnsafeKey, toArrayIndex, toSegments } from './path-utils';

/**
 * 是否为「普通对象」——— plain object、`Object.create(null)`、以及用户类的实例。
 *
 * 用 toString tag 而不是 `typeof === 'object'`：后者会把 Map / Set / RegExp / Promise 这些 **内建 exotic
 * 对象**也算进来，而它们的行为依赖引擎内部槽（internal slot）， 用 `Object.create` + 属性描述符是拷不出来的 —— 拷出来的东西 `instanceof Map`
 * 为真， 但一调 `.get()` 就抛 `TypeError: called on incompatible receiver`。 造一个「谎报类型且一用就炸」的对象，比直接换成 `{}` 更坏。
 */
const isOrdinaryObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

/**
 * 为写入准备一个新容器（不改原对象）。
 *
 * 数组 → slice，plain object → 展开。 类实例 / `Object.create(null)` 保留原型做浅拷贝：直接换成 `{}` 会让节点上原有的字段静默消失。
 * 其余（原始值、Date、Map 等内建对象）视为叶子，按目标段类型新建容器覆盖 —— 与改动前行为一致。
 */
function cloneContainer(node: unknown, key: Key): any {
  if (Array.isArray(node)) return node.slice();

  if (isPlainObject(node)) return { ...node };

  if (isOrdinaryObject(node)) {
    return Object.create(Object.getPrototypeOf(node), Object.getOwnPropertyDescriptors(node));
  }

  return emptyContainer(key);
}

/** Immutable deep set. Creates intermediate containers as needed and never mutates the original object. */
// oxlint-disable-next-line max-params -- (obj, path, value, options) 是既有公开签名，收敛成 options 对象会破坏所有调用方
export function deepSet<T, V>(obj: T, path: NamePath, value: V, options: SetOptions = { safeKeys: true }): T {
  const segs = toSegments(path);

  if (segs.length === 0) return obj;

  const { safeKeys = true } = options;

  function setImpl(node: unknown, index: number): unknown {
    const key = segs[index];

    if (safeKeys && isUnsafeKey(key)) {
      return node;
    }

    const isLast = index === segs.length - 1;

    const base = cloneContainer(node, key);

    if (isLast) {
      base[key as any] = value;

      return base;
    }

    const nextChild = isObjectLike(node) ? node[key] : undefined;

    base[key as any] = setImpl(nextChild, index + 1);

    return base;
  }

  return setImpl(obj, 0) as T;
}

export function deepUnset<T>(obj: T, path: NamePath, options: SetOptions = { safeKeys: true }): T {
  const segs = toSegments(path);

  if (segs.length === 0) return obj;

  const { safeKeys = true } = options;

  function unsetImpl(node: unknown, index: number): unknown {
    const key = segs[index];

    if (safeKeys && isUnsafeKey(key)) return node;

    const isLast = index === segs.length - 1;

    if (Array.isArray(node)) {
      const arrayIndex = toArrayIndex(key);

      // 非法下标不能交给 splice —— 它会把 NaN 当 0，删掉第一个元素
      if (arrayIndex === null) return node;

      const arr = node.slice();

      if (isLast) {
        arr.splice(arrayIndex, 1);
        return arr;
      }

      arr[arrayIndex] = unsetImpl(arr[arrayIndex], index + 1);
      return arr;
    }

    if (isPlainObject(node)) {
      const out: Record<string, unknown> = {};

      for (const keyInNode of Object.keys(node)) {
        if (isLast && keyInNode === key) {
          continue;
        }

        out[keyInNode] = keyInNode === key ? unsetImpl(node[keyInNode], index + 1) : node[keyInNode];
      }

      return out;
    }

    return node;
  }

  return unsetImpl(obj, 0) as T;
}

export const unflatten = <T extends Record<string, any>>(obj: T): T => {
  if (!obj) return {} as T;

  let acc: Record<string, any> = {};

  for (const [path, value] of Object.entries(obj)) {
    acc = deepSet(acc, path, value);
  }

  return acc as T;
};
