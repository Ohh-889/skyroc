import type { Atomic, IsTuple } from './primitive';

/**
 * 展平交叉类型，让 IDE 提示可读。不改变类型语义。
 *
 * @example
 *   type Raw = { a: number } & { b: string };
 *   type T = Prettify<Raw>; // { a: number; b: string }
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * 联合转交叉：`A | B` => `A & B`。
 *
 * @example
 *   type T = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
 */
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

/**
 * 把对象联合合并成单个对象，并展平显示。
 *
 * 只合并顶层：`{ a: { b: 1 } } | { a: { c: 2 } }` 合并后 `a` 仍是交叉类型 `{ b: 1 } & { c: 2 }`， 语义正确但 IDE 里不会拍平。
 *
 * @example
 *   type T = MergeUnion<{ a: 1 } | { b: 2 }>; // { a: 1; b: 2 }
 */
export type MergeUnion<U> = Prettify<UnionToIntersection<U>>;

/**
 * 用一个键名把值包成对象。键名是联合时会展开成多个属性。
 *
 * @example
 *   type T = Wrap<'a', number>; // { a: number }
 */
export type Wrap<K extends string, V> = { [P in K]: V };

/**
 * 递归可选化。
 *
 * - 命中 {@link Atomic} 的类型原样返回 —— `Date` / `RegExp` / `Map` / 函数不会被拆成一堆可选成员
 * - 元组保持定长与可选性形状，逐项递归
 * - 数组保持 `T[]` / `readonly T[]` 的可变性，只对**元素类型**递归，不会让元素变成 `T | undefined`
 * - 其余对象逐字段加 `?` 并继续向下
 *
 * @example
 *   type Cfg = { when: Date; list: { id: number }[]; nested: { a: { b: string } } };
 *   type T = DeepPartial<Cfg>;
 *   // => { when?: Date; list?: { id?: number }[]; nested?: { a?: { b?: string } } }
 */
export type DeepPartial<T> = T extends Atomic
  ? T
  : IsTuple<T> extends true
    ? { [K in keyof T]: DeepPartial<T[K]> }
    : T extends ReadonlyArray<infer U>
      ? T extends U[]
        ? DeepPartial<U>[]
        : readonly DeepPartial<U>[]
      : { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * 单层可选化：只把最外层对象的字段变成可选，不向下递归。
 *
 * 命中 {@link Atomic} 的类型和数组原样返回。
 *
 * @example
 *   type T = ShallowPartial<{ a: number; b: { c: string } }>;
 *   // => { a?: number; b?: { c: string } }
 */
export type ShallowPartial<T> = T extends Atomic ? T : T extends readonly any[] ? T : { [K in keyof T]?: T[K] };
