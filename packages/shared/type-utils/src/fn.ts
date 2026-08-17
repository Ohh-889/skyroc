/** 任意函数签名。用作「这个位置是不是函数」的判定基准。 */
export type Fn = (...args: any[]) => any;

/** 无参无返回的回调。 */
export type Noop = () => void;

/**
 * 挑出对象里所有函数类型的属性，保留其可选性。
 *
 * @example
 *   interface Foo {
 *     a: number;
 *     b?: string;
 *     c(): void;
 *     d: (x: number) => string;
 *     e?: () => void;
 *   }
 *   type T = OnlyFunctions<Foo>;
 *   // => { c: () => void; d: (x: number) => string; e?: (() => void) | undefined }
 */
export type OnlyFunctions<T> = {
  [K in keyof T as NonNullable<T[K]> extends Fn ? K : never]: T[K];
};

/**
 * 取出对象里所有函数属性的键名。
 *
 * 映射用 `-?` 去掉可选修饰，因此可选的函数属性只贡献键名本身，不会额外带出 `undefined`。
 *
 * @example
 *   interface Foo {
 *     a: number;
 *     b?: string;
 *     c(): void;
 *     d: (x: number) => string;
 *     e?: () => void;
 *   }
 *   type T = FunctionKeys<Foo>; // 'c' | 'd' | 'e'
 */
export type FunctionKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Fn ? K : never;
}[keyof T];

/**
 * 取出对象里所有函数属性的类型联合（已去除 `undefined`）。
 *
 * @example
 *   interface Foo {
 *     a: number;
 *     b?: string;
 *     c(): void;
 *     d: (x: number) => string;
 *     e?: () => void;
 *   }
 *   type T = FunctionUnion<Foo>; // (() => void) | ((x: number) => string)
 */
export type FunctionUnion<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends Fn ? NonNullable<T[K]> : never;
}[keyof T];
