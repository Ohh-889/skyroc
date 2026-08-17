import { describe, expectTypeOf, it } from 'vitest';
import type { CustomElement, FieldElement } from '../src/web';

describe('FieldElement', () => {
  it('接受三种原生输入元素', () => {
    expectTypeOf<HTMLInputElement>().toExtend<FieldElement>();
    expectTypeOf<HTMLSelectElement>().toExtend<FieldElement>();
    expectTypeOf<HTMLTextAreaElement>().toExtend<FieldElement>();
  });

  it('接受自定义控件', () => {
    expectTypeOf<{ checked: boolean; type: string; value: string }>().toExtend<FieldElement>();
  });
});

describe('CustomElement', () => {
  it('可以并入控件自有字段', () => {
    expectTypeOf<CustomElement<{ multiple: boolean }>['multiple']>().toEqualTypeOf<boolean>();
    expectTypeOf<CustomElement['checked']>().toEqualTypeOf<boolean | undefined>();
  });
});

describe('平台边界', () => {
  // 这些类型依赖 DOM 全局，所以必须留在 /web 子路径下。
  // 「根出口不得引用 DOM」由 platform-boundary.test.ts 静态校验。
  it('CustomElement 依赖 DOM 全局类型', () => {
    expectTypeOf<CustomElement>().toExtend<Partial<HTMLElement>>();
  });
});
