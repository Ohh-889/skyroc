import { describe, expect, it } from 'vitest';
import { diff, isEventObject, isObjectType, shallowEqual } from '../src/object';

// ==================== shallowEqual ====================

describe('shallowEqual', () => {
  it('相同引用应相等', () => {
    const obj = { a: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });

  it('值相同的对象应相等', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('值不同的对象应不相等', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('键数量不同应不相等', () => {
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('空对象应相等', () => {
    expect(shallowEqual({}, {})).toBe(true);
  });

  it('基本类型相等应返回 true', () => {
    expect(shallowEqual(1, 1)).toBe(true);
    expect(shallowEqual('a', 'a')).toBe(true);
    expect(shallowEqual(Number.NaN, Number.NaN)).toBe(true);
  });

  it('基本类型不等应返回 false', () => {
    expect(shallowEqual(1, 2)).toBe(false);
  });

  it('null 和 对象应不相等', () => {
    expect(shallowEqual(null, {})).toBe(false);
    expect(shallowEqual({}, null)).toBe(false);
  });

  it('嵌套对象只做浅比较', () => {
    const nested1 = { a: { b: 1 } };
    const nested2 = { a: { b: 1 } };
    expect(shallowEqual(nested1, nested2)).toBe(false);
  });
});

// ==================== isObjectType ====================

describe('isObjectType', () => {
  it('普通对象应返回 true', () => {
    expect(isObjectType({})).toBe(true);
  });

  it('数组应返回 true', () => {
    expect(isObjectType([])).toBe(true);
  });

  it('null 应返回 false（不能因为 typeof null === "object" 就把 null 收窄成 object）', () => {
    expect(isObjectType(null)).toBe(false);
  });

  it('基本类型应返回 false', () => {
    expect(isObjectType(1)).toBe(false);
    expect(isObjectType('str')).toBe(false);
    expect(isObjectType(true)).toBe(false);
    expect(isObjectType(undefined)).toBe(false);
  });
});

// ==================== isEventObject ====================

describe('isEventObject', () => {
  it('普通对象应返回 true', () => {
    expect(isEventObject({ type: 'click' })).toBe(true);
  });

  it('Event 实例应返回 true', () => {
    const event = new Event('click');
    expect(isEventObject(event)).toBe(true);
  });

  it('数组应返回 false', () => {
    expect(isEventObject([1, 2])).toBe(false);
  });

  it('null 应返回 false', () => {
    expect(isEventObject(null)).toBe(false);
  });

  it('undefined 应返回 false', () => {
    expect(isEventObject(undefined)).toBe(false);
  });

  it('Date 应返回 false', () => {
    expect(isEventObject(new Date())).toBe(false);
  });

  it('基本类型应返回 false', () => {
    expect(isEventObject(42)).toBe(false);
    expect(isEventObject('str')).toBe(false);
  });
});

// ==================== diff ====================

describe('diff', () => {
  it('相同对象应返回 undefined', () => {
    expect(diff({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeUndefined();
  });

  it('值不同应返回差异', () => {
    expect(diff({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('嵌套对象应递归比较', () => {
    const obj1 = { a: { b: 1, c: 2 } };
    const obj2 = { a: { b: 1, c: 3 } };
    expect(diff(obj1, obj2)).toEqual({ a: { c: 3 } });
  });

  it('新增键应出现在差异中', () => {
    const obj1 = { a: 1 } as any;
    const obj2 = { a: 1, b: 2 } as any;
    expect(diff(obj1, obj2)).toEqual({ b: 2 });
  });

  it('数组元素不同应返回新数组', () => {
    const obj1 = { list: [1, 2, 3] };
    const obj2 = { list: [1, 2, 4] };
    expect(diff(obj1, obj2)).toEqual({ list: [1, 2, 4] });
  });

  it('数组元素相同（不同顺序）应无差异', () => {
    const obj1 = { list: [1, 2, 3] };
    const obj2 = { list: [3, 1, 2] };
    expect(diff(obj1, obj2)).toBeUndefined();
  });

  it('空对象应无差异', () => {
    expect(diff({}, {})).toBeUndefined();
  });
});
