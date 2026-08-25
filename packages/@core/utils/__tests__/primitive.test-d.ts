import { describe, expectTypeOf, it } from 'vitest';
import type { Atomic, IsAny, IsTuple, Primitive } from '../src/type';

describe('Primitive', () => {
  it('只包含语言层面的原始类型', () => {
    expectTypeOf<string>().toExtend<Primitive>();
    expectTypeOf<number>().toExtend<Primitive>();
    expectTypeOf<bigint>().toExtend<Primitive>();
    expectTypeOf<symbol>().toExtend<Primitive>();
    expectTypeOf<null>().toExtend<Primitive>();
    expectTypeOf<undefined>().toExtend<Primitive>();
  });

  it('不再把 Date / 函数算作原始类型', () => {
    expectTypeOf<Date extends Primitive ? true : false>().toEqualTypeOf<false>();
    expectTypeOf<(() => void) extends Primitive ? true : false>().toEqualTypeOf<false>();
  });
});

describe('Atomic', () => {
  it('覆盖所有「结构是对象、语义是值」的内置类型', () => {
    expectTypeOf<Date>().toExtend<Atomic>();
    expectTypeOf<RegExp>().toExtend<Atomic>();
    expectTypeOf<Error>().toExtend<Atomic>();
    expectTypeOf<Map<string, number>>().toExtend<Atomic>();
    expectTypeOf<Set<string>>().toExtend<Atomic>();
    expectTypeOf<ReadonlyMap<string, number>>().toExtend<Atomic>();
    expectTypeOf<ReadonlySet<string>>().toExtend<Atomic>();
    expectTypeOf<(x: number) => string>().toExtend<Atomic>();
    expectTypeOf<Primitive>().toExtend<Atomic>();
  });

  it('普通对象与数组不是 Atomic', () => {
    expectTypeOf<{ a: 1 } extends Atomic ? true : false>().toEqualTypeOf<false>();
    expectTypeOf<string[] extends Atomic ? true : false>().toEqualTypeOf<false>();
  });
});

describe('IsAny', () => {
  it('只对 any 为真', () => {
    expectTypeOf<IsAny<any>>().toEqualTypeOf<true>();
    expectTypeOf<IsAny<unknown>>().toEqualTypeOf<false>();
    expectTypeOf<IsAny<never>>().toEqualTypeOf<false>();
    expectTypeOf<IsAny<string>>().toEqualTypeOf<false>();
  });
});

describe('IsTuple', () => {
  it('区分定长元组与变长数组', () => {
    expectTypeOf<IsTuple<[string, number]>>().toEqualTypeOf<true>();
    expectTypeOf<IsTuple<readonly [string]>>().toEqualTypeOf<true>();
    expectTypeOf<IsTuple<string[]>>().toEqualTypeOf<false>();
    expectTypeOf<IsTuple<readonly string[]>>().toEqualTypeOf<false>();
    expectTypeOf<IsTuple<{ a: 1 }>>().toEqualTypeOf<false>();
  });
});
