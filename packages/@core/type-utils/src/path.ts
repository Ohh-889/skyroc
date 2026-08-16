import type { DeepPartial, MergeUnion, ShallowPartial, Wrap } from './object';
import type { Atomic, IsAny } from './primitive';

/**
 * 拼接路径段：空前缀时直接返回段名，否则用 `.` 连接。
 *
 * @example
 *   type A = Join<'', 'user'>; // 'user'
 *   type B = Join<'user', 'name'>; // 'user.name'
 *   type C = Join<'list', number>; // `list.${number}`
 */
export type Join<P extends string, K extends string | number> = P extends '' ? `${K}` : `${P}.${K}`;

/** 递归深度递减表。`Prev[0]` 为 `never`，用作递归出口。 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...0[]];

/** 默认递归深度。递归类型（如树节点）超过这个层数后停止展开，避免 TS2589。 */
type DefaultDepth = 6;

/** 路径段是否为数组下标。`'number'` 是「任意下标」的通配写法。 */
type IsIndexSeg<S extends string> = S extends `${number}` | 'number' ? true : false;

/**
 * 枚举所有**叶子**路径（不含中间对象本身）。
 *
 * 遇到 {@link Atomic} 即停止下探；数组统一用 `${number}` 表示下标； 递归结构由 `Depth` 兜底，默认 6 层。
 *
 * @example
 *   type FormValues = {
 *     age: number;
 *     info: { city: string; name: string };
 *     list: { id: number }[];
 *   };
 *   type T = LeafPaths<FormValues>;
 *   // => 'age' | 'info.city' | 'info.name' | `list.${number}.id`
 */
export type LeafPaths<T, P extends string = '', Depth extends number = DefaultDepth> = [Depth] extends [never]
  ? never
  : T extends Atomic
    ? P extends ''
      ? never
      : P
    : T extends readonly (infer U)[]
      ? LeafPaths<U, Join<P, number>, Prev[Depth]>
      : T extends object
        ? {
            [K in Extract<keyof T, string>]-?: LeafPaths<NonNullable<T[K]>, Join<P, K>, Prev[Depth]>;
          }[Extract<keyof T, string>]
        : never;

/**
 * 枚举所有路径，**包含**中间对象与数组本身。
 *
 * @example
 *   type FormValues = {
 *     age: number;
 *     info: { city: string; pl: { deep: string } };
 *     list: { id: number }[];
 *   };
 *   type T = AllPaths<FormValues>;
 *   // => 'age' | 'info' | 'info.city' | 'info.pl' | 'info.pl.deep'
 *   //  | 'list' | `list.${number}` | `list.${number}.id`
 */
export type AllPaths<T, P extends string = '', Depth extends number = DefaultDepth> = [Depth] extends [never]
  ? never
  : T extends Atomic
    ? P extends ''
      ? never
      : P
    : T extends readonly (infer U)[]
      ? (P extends '' ? never : P) | AllPaths<U, Join<P, number>, Prev[Depth]>
      : T extends object
        ?
            | (P extends '' ? never : P)
            | {
                [K in Extract<keyof T, string>]-?: AllPaths<NonNullable<T[K]>, Join<P, K>, Prev[Depth]>;
              }[Extract<keyof T, string>]
        : never;

/**
 * 所有路径的键名联合。`AllPaths` 的语义别名，表单场景下的主力类型。
 *
 * @example
 *   type T = AllPathsKeys<{ a: { b: string } }>; // 'a' | 'a.b'
 */
export type AllPathsKeys<T> = AllPaths<T>;

/**
 * 把所有路径摊成一个 `Record<path, true>`，便于做键存在性检查。
 *
 * @example
 *   type T = AllPathsShape<{ a: { b: string } }>; // { a: true; 'a.b': true }
 */
export type AllPathsShape<T> = { [K in AllPaths<T>]: true };

/**
 * 按点分路径取值。
 *
 * - 路径无效时返回 `never`（而不是 `any`）—— 拼错的路径会在编译期暴露
 * - `T` 为 `any` 时整体返回 `any`，保证泛型默认值为 `any` 的调用方不受影响
 * - 真实字段优先于下标解析：对象上真有一个叫 `number` 的字段时取该字段，不会被当成数组通配符
 * - 数组下标可写具体数字，也可用 `number` 表示任意元素
 *
 * @example
 *   type FormValues = { age: number; info: { city: string }; list: { id: number }[] };
 *   type A = PathValue<FormValues, 'info.city'>; // string
 *   type B = PathValue<FormValues, 'list.0.id'>; // number
 *   type C = PathValue<FormValues, 'list.number.id'>; // number
 *   type D = PathValue<FormValues, 'infoo.city'>; // never
 */
export type PathValue<T, P extends string> =
  IsAny<T> extends true
    ? any
    : T extends Atomic
      ? never
      : P extends `${infer K}.${infer R}`
        ? K extends keyof T
          ? PathValue<T[K], R>
          : T extends readonly (infer U)[]
            ? IsIndexSeg<K> extends true
              ? PathValue<U, R>
              : never
            : never
        : P extends keyof T
          ? T[P]
          : T extends readonly (infer U)[]
            ? IsIndexSeg<P> extends true
              ? U
              : never
            : never;

/**
 * 取路径对应的类型，并把**最外层**对象字段可选化。
 *
 * @example
 *   type FormValues = { info: { city: string; pl: { deep: string } } };
 *   type A = PathToType<FormValues, 'info'>; // { city?: string; pl?: { deep: string } }
 *   type B = PathToType<FormValues, 'info.pl'>; // { deep?: string }
 */
export type PathToType<T, P extends string> = ShallowPartial<PathValue<T, P>>;

/**
 * 取路径对应的类型，并**递归**可选化。
 *
 * 表单场景的默认选择：订阅到的嵌套值随时可能只填了一半，深层字段都应是可选的。
 *
 * @example
 *   type FormValues = { info: { city: string; pl: { deep: string } }; list: { id: number }[] };
 *   type A = PathToDeepType<FormValues, 'info'>; // { city?: string; pl?: { deep?: string } }
 *   type B = PathToDeepType<FormValues, 'list'>; // { id?: number }[]
 */
export type PathToDeepType<T, P extends string> = DeepPartial<PathValue<T, P>>;

/** 由单条路径反推出的最小对象骨架。 */
type BuildShape<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends Extract<keyof T, string>
    ? NonNullable<T[K]> extends readonly (infer U)[]
      ? R extends `${infer I}.${infer R2}`
        ? IsIndexSeg<I> extends true
          ? Wrap<K, BuildShape<U, R2>[]>
          : never
        : IsIndexSeg<R> extends true
          ? Wrap<K, DeepPartial<U>[]>
          : Wrap<K, BuildShape<U, R>[]>
      : Wrap<K, BuildShape<T[K], R>>
    : never
  : P extends Extract<keyof T, string>
    ? Wrap<P, DeepPartial<T[P]>>
    : never;

/**
 * 由一组路径反推出覆盖这些路径的最小对象类型，未被引用的字段不出现。
 *
 * 路径列表为空时返回 `T` 本身。
 *
 * @example
 *   type FormValues = {
 *     age: number;
 *     code: string;
 *     info: { city: string; name: string };
 *     list: { id: number; tag: string }[];
 *   };
 *   type T = ShapeFromPaths<FormValues, ['age', 'info', 'list.2.tag']>;
 *   // => { age: number; info: { city?: string; name?: string }; list: { tag?: string }[] }
 */
export type ShapeFromPaths<T, Ps extends readonly string[]> = [Ps[number]] extends [never]
  ? T
  : MergeUnion<Ps[number] extends infer P ? (P extends string ? BuildShape<T, P> : never) : never>;

/**
 * 取出对象里所有数组字段的键名。
 *
 * 可选的数组字段只贡献键名，不会带出 `undefined`；没有任何数组字段时结果是 `never`。
 *
 * @example
 *   type Inputs = { name: string; tags: string[]; users?: { id: number }[] };
 *   type T = ArrayKeys<Inputs>; // 'tags' | 'users'
 */
export type ArrayKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends readonly any[] ? K : never;
}[keyof T];

/**
 * 取数组字段 `K` 的元素类型。`readonly` 数组同样支持；字段不是数组时返回 `never`。
 *
 * @example
 *   type Inputs = { tags: readonly string[]; users: { id: number }[] };
 *   type A = ArrayElementValue<Inputs, 'tags'>; // string
 *   type B = ArrayElementValue<Inputs, 'users'>; // { id: number }
 */
export type ArrayElementValue<T, K extends keyof T> = NonNullable<T[K]> extends readonly (infer U)[] ? U : never;
