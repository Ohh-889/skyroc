import { describe, expect, it } from 'vitest';
import { deepSet, deepUnset, unflatten } from '../src/set';

describe('deepSet', () => {
  it('writes nested object values immutably', () => {
    const source = { profile: { name: 'Alex' } };
    const next = deepSet(source, 'profile.age', 18);

    expect(next).toEqual({ profile: { age: 18, name: 'Alex' } });
    expect(source).toEqual({ profile: { name: 'Alex' } });
    expect(next).not.toBe(source);
    expect(next.profile).not.toBe(source.profile);
  });

  it('creates array containers for numeric path segments', () => {
    expect(deepSet({}, 'items[0].title', 'First')).toEqual({ items: [{ title: 'First' }] });
    expect(deepSet(undefined, [0, 'title'], 'First')).toEqual([{ title: 'First' }]);
  });

  it('writes into existing array containers immutably', () => {
    const source = ['first'];
    const next = deepSet(source, 1, 'second');

    expect(next).toEqual(['first', 'second']);
    expect(source).toEqual(['first']);
    expect(next).not.toBe(source);
  });

  it('returns the original object for empty paths', () => {
    const source = { profile: { name: 'Alex' } };

    expect(deepSet(source, [], 'Next')).toBe(source);
  });

  it('blocks unsafe keys by default', () => {
    const source = { profile: { name: 'Alex' } };

    expect(deepSet(source, '__proto__.polluted', true)).toBe(source);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('路径为 undefined 时原样返回，不写出字面量 "undefined" 键', () => {
    // 回归：toSegments(undefined) 曾返回 [undefined]
    expect(deepSet({ a: 1 }, undefined, 9)).toEqual({ a: 1 });
  });

  it('穿过类实例时保留原型与原有字段，而不是替换成空对象', () => {
    // 回归：isPlainObject 对类实例返回 false，旧实现直接换成 {}，name 会静默丢失
    class User {
      name = 'alex';

      greet() {
        return this.name;
      }
    }

    const next = deepSet({ user: new User() }, 'user.age', 30) as { user: User & { age: number } };

    expect(next.user.name).toBe('alex');
    expect(next.user.age).toBe(30);
    expect(next.user).toBeInstanceOf(User);
    expect(next.user.greet()).toBe('alex');
  });

  it('穿过 Object.create(null) 时保留原有字段', () => {
    const bare = Object.create(null);
    bare.keep = 1;

    expect(deepSet({ bare }, 'bare.added', 2)).toEqual({ bare: { added: 2, keep: 1 } });
  });

  it('内建 exotic 对象按叶子处理，不做保原型拷贝', () => {
    // Object.create + 描述符拷不出引擎内部槽，拷出来的 Map 一调 .get() 就抛
    // TypeError；宁可退回「换成空容器」，也不要造一个谎报类型的对象
    const next = deepSet({ m: new Map([['a', 1]]) }, 'm.foo', 2) as { m: unknown };

    expect(next.m).toEqual({ foo: 2 });
    expect(next.m).not.toBeInstanceOf(Map);

    const withDate = deepSet({ d: new Date('2026-01-01') }, 'd.foo', 1) as { d: unknown };
    expect(withDate.d).toEqual({ foo: 1 });
  });

  it('allows unsafe keys when safeKeys is disabled', () => {
    expect(deepSet({}, 'constructor.value', 1, { safeKeys: false })).toEqual({ constructor: { value: 1 } });
  });
});

describe('deepUnset', () => {
  it('removes object keys immutably', () => {
    const source = { profile: { age: 18, name: 'Alex' } };
    const next = deepUnset(source, 'profile.age');

    expect(next).toEqual({ profile: { name: 'Alex' } });
    expect(source).toEqual({ profile: { age: 18, name: 'Alex' } });
  });

  it('removes array items by index', () => {
    const source = { items: ['first', 'second'] };

    expect(deepUnset(source, ['items', 0])).toEqual({ items: ['second'] });
  });

  it('removes nested values inside array items immutably', () => {
    const source = [{ meta: { stale: true }, title: 'First' }];
    const next = deepUnset(source, [0, 'meta', 'stale']);

    expect(next).toEqual([{ meta: {}, title: 'First' }]);
    expect(source).toEqual([{ meta: { stale: true }, title: 'First' }]);
    expect(next).not.toBe(source);
    expect(next[0]).not.toBe(source[0]);
  });

  it('数组遇到非法下标时原样返回，不会误删第一个元素', () => {
    // 回归：splice('foo', 1) 会把 NaN 当 0，删掉 index 0
    expect(deepUnset({ list: [1, 2, 3] }, 'list.foo')).toEqual({ list: [1, 2, 3] });
    expect(deepUnset({ list: [1, 2, 3] }, ['list', '01'])).toEqual({ list: [1, 2, 3] });
    expect(deepUnset({ list: [1, 2, 3] }, ['list', -1])).toEqual({ list: [1, 2, 3] });
  });

  it('tuple 形式的数字字符串下标仍按下标处理', () => {
    expect(deepUnset({ list: [1, 2, 3] }, ['list', '1'])).toEqual({ list: [1, 3] });
  });

  it('returns primitive roots unchanged when there is nothing to remove', () => {
    expect(deepUnset(1 as any, 'profile.name')).toBe(1);
  });

  it('returns the original value for empty paths and unsafe keys', () => {
    const source = { profile: { name: 'Alex' } };

    expect(deepUnset(source, [])).toBe(source);
    expect(deepUnset(source, '__proto__.polluted')).toBe(source);
  });
});

describe('unflatten', () => {
  it('expands flat path records into nested structures', () => {
    expect(
      unflatten({
        'items[0].title': 'First',
        'profile.name': 'Alex'
      })
    ).toEqual({
      items: [{ title: 'First' }],
      profile: { name: 'Alex' }
    });
  });

  it('returns an empty object for nullish input', () => {
    expect(unflatten(null as any)).toEqual({});
  });
});
