import { describe, expectTypeOf, it } from 'vitest';
import type { DeepPartial, MergeUnion, Prettify, ShallowPartial, UnionToIntersection, Wrap } from '../src';

describe('Prettify', () => {
  it('展平交叉类型', () => {
    expectTypeOf<Prettify<{ a: number } & { b: string }>>().toEqualTypeOf<{ a: number; b: string }>();
  });
});

describe('UnionToIntersection / MergeUnion', () => {
  it('联合转交叉', () => {
    expectTypeOf<UnionToIntersection<{ a: 1 } | { b: 2 }>>().toEqualTypeOf<{ a: 1 } & { b: 2 }>();
  });

  it('合并后展平为单个对象', () => {
    expectTypeOf<MergeUnion<{ a: 1 } | { b: 2 }>>().toEqualTypeOf<{ a: 1; b: 2 }>();
  });
});

describe('Wrap', () => {
  it('用键名包住值', () => {
    expectTypeOf<Wrap<'a', number>>().toEqualTypeOf<{ a: number }>();
  });

  it('联合键名展开成多个属性', () => {
    expectTypeOf<Wrap<'a' | 'b', number>>().toEqualTypeOf<{ a: number; b: number }>();
  });
});

describe('DeepPartial', () => {
  it('逐层可选化普通对象', () => {
    expectTypeOf<DeepPartial<{ a: number; nested: { b: { c: string } } }>>().toEqualTypeOf<{
      a?: number;
      nested?: { b?: { c?: string } };
    }>();
  });

  // 回归：判定条件曾是 `T[K] extends object`，Date 会被拆成一堆可选方法
  it('不拆解 Date / RegExp / Map / Set / 函数', () => {
    expectTypeOf<DeepPartial<{ when: Date }>>().toEqualTypeOf<{ when?: Date }>();
    expectTypeOf<DeepPartial<{ re: RegExp }>>().toEqualTypeOf<{ re?: RegExp }>();
    expectTypeOf<DeepPartial<{ m: Map<string, number> }>>().toEqualTypeOf<{ m?: Map<string, number> }>();
    expectTypeOf<DeepPartial<{ s: Set<string> }>>().toEqualTypeOf<{ s?: Set<string> }>();
    expectTypeOf<DeepPartial<{ cb: (x: number) => string }>>().toEqualTypeOf<{ cb?: (x: number) => string }>();
  });

  // 回归：同态映射曾把 `?` 施加到数组下标上，元素被污染成 `T | undefined`
  it('数组只对元素类型递归，不让元素变成可能 undefined', () => {
    expectTypeOf<DeepPartial<{ list: { id: number }[] }>>().toEqualTypeOf<{ list?: { id?: number }[] }>();
    expectTypeOf<DeepPartial<{ tags: string[] }>>().toEqualTypeOf<{ tags?: string[] }>();
  });

  it('保留数组的可变性', () => {
    expectTypeOf<DeepPartial<{ ro: readonly { id: number }[] }>>().toEqualTypeOf<{
      ro?: readonly { id?: number }[];
    }>();
  });

  it('保留元组的定长形状', () => {
    expectTypeOf<DeepPartial<{ pair: [{ a: number }, string] }>>().toEqualTypeOf<{
      pair?: [{ a?: number }, string];
    }>();
  });

  it('顶层原始类型原样返回', () => {
    expectTypeOf<DeepPartial<string>>().toEqualTypeOf<string>();
  });

  it('递归类型不触发无限展开', () => {
    interface TreeNode {
      children: TreeNode[];
      name: string;
    }
    expectTypeOf<DeepPartial<TreeNode>['name']>().toEqualTypeOf<string | undefined>();
  });
});

describe('ShallowPartial', () => {
  it('只可选化最外层', () => {
    expectTypeOf<ShallowPartial<{ a: number; b: { c: string } }>>().toEqualTypeOf<{
      a?: number;
      b?: { c: string };
    }>();
  });

  it('Atomic 与数组原样返回', () => {
    expectTypeOf<ShallowPartial<Date>>().toEqualTypeOf<Date>();
    expectTypeOf<ShallowPartial<string[]>>().toEqualTypeOf<string[]>();
  });
});
