import type { Fn } from './fn';

/**
 * 真正的 JavaScript 原始类型。
 *
 * 只包含语言层面的 primitive，不含 `Date` / `Function` 等「结构上是对象」的内置类型 —— 那些请用 {@link Atomic}。
 *
 * @example
 *   type A = 'x' extends Primitive ? true : false; // true
 *   type B = Date extends Primitive ? true : false; // false
 */
export type Primitive = bigint | boolean | number | string | symbol | null | undefined;

/**
 * 递归终止类型：深度遍历（{@link DeepPartial}、`LeafPaths`、`AllPaths` 等）遇到这些类型时停止向内展开。
 *
 * 在 {@link Primitive} 之上补齐「结构上是对象、语义上是单个值」的内置类型。 少了这一层，`DeepPartial<Date>` 会把 `Date` 拆成一堆可选方法，`AllPaths` 会把 `Map`
 * 的内部方法当成字段路径。
 *
 * @example
 *   type A = Date extends Atomic ? true : false; // true
 *   type B = { a: 1 } extends Atomic ? true : false; // false
 */
export type Atomic =
  | Fn
  | Primitive
  | Date
  | Error
  | Map<any, any>
  | ReadonlyMap<any, any>
  | ReadonlySet<any>
  | RegExp
  | Set<any>
  | WeakMap<object, any>
  | WeakSet<object>;

/**
 * 判断 `T` 是否为 `any`。
 *
 * `any` 会同时命中条件类型的两个分支，导致递归工具类型给出意义不明的联合。 需要对 `any` 单独短路时用它。
 *
 * @example
 *   type A = IsAny<any>; // true
 *   type B = IsAny<unknown>; // false
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * 判断 `T` 是否为定长元组（而非变长数组）。
 *
 * @example
 *   type A = IsTuple<[string, number]>; // true
 *   type B = IsTuple<string[]>; // false
 */
export type IsTuple<T> = T extends readonly any[] ? (number extends T['length'] ? false : true) : false;
