import { describe, expectTypeOf, it } from 'vitest';
import type { Fn, FunctionKeys, FunctionUnion, Noop, OnlyFunctions } from '../src';

interface Foo {
  a: number;
  b?: string;
  c: () => void;
  d: (x: number) => string;
  e?: () => void;
}

describe('Fn / Noop', () => {
  it('匹配任意函数签名', () => {
    expectTypeOf<() => void>().toExtend<Fn>();
    expectTypeOf<(a: string, b: number) => Promise<void>>().toExtend<Fn>();
    expectTypeOf<Noop>().toEqualTypeOf<() => void>();
  });
});

describe('OnlyFunctions', () => {
  it('保留函数属性及其可选性', () => {
    expectTypeOf<OnlyFunctions<Foo>>().toEqualTypeOf<{
      c: () => void;
      d: (x: number) => string;
      e?: () => void;
    }>();
  });
});

describe('FunctionKeys', () => {
  // 回归：映射曾经写成 `[K in keyof T]?:`，导致结果里混入 undefined
  it('可选的函数属性不会带出 undefined', () => {
    expectTypeOf<FunctionKeys<Foo>>().toEqualTypeOf<'c' | 'd' | 'e'>();
  });

  it('没有函数属性时为 never', () => {
    expectTypeOf<FunctionKeys<{ a: number; b: string }>>().toBeNever();
  });
});

describe('FunctionUnion', () => {
  it('返回去掉 undefined 的函数类型联合', () => {
    expectTypeOf<FunctionUnion<Foo>>().toEqualTypeOf<(() => void) | ((x: number) => string)>();
  });

  it('没有函数属性时为 never', () => {
    expectTypeOf<FunctionUnion<{ a: number }>>().toBeNever();
  });
});
