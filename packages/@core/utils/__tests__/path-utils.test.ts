import { describe, expect, it } from 'vitest';
import {
  collectDeepKeys,
  emptyContainer,
  isObjectLike,
  isObjectRecord,
  isPlainObject,
  isUnderPrefix,
  isUnsafeKey,
  keyOfName,
  keyOfTuple,
  toArrayIndex,
  toPathArray,
  toSegments
} from '../src/path-utils';

describe('path parsing', () => {
  it('parses dot paths, numeric brackets, and quoted brackets', () => {
    expect(toPathArray('user.addresses[0].city')).toEqual(['user', 'addresses', 0, 'city']);
    expect(toPathArray('items["sku.code"]')).toEqual(['items', 'sku.code']);
    expect(toPathArray("items['sku.code']")).toEqual(['items', 'sku.code']);
    expect(toPathArray('items[01]')).toEqual(['items', '01']);
  });

  it('normalizes supported name path inputs into segments', () => {
    const tuple = ['user', 0] as const;

    expect(toSegments(tuple)).toEqual(['user', 0]);
    expect(toSegments(tuple)).not.toBe(tuple);
    expect(toSegments('user[0]')).toEqual(['user', 0]);
    expect(toSegments(0)).toEqual([0]);
  });

  it('归一 undefined 路径为空数组，而不是 [undefined] 段', () => {
    // 回归：返回 [undefined] 会让 deepSet 写出字面量 "undefined" 键
    expect(toSegments(undefined)).toEqual([]);
    expect(keyOfName(undefined)).toBe('');
  });

  it('creates string keys from tuple and name paths', () => {
    expect(keyOfTuple(['user', 'name'])).toBe('user.name');
    expect(keyOfName('user.name')).toBe('user.name');
    expect(keyOfName(['user', 'name'])).toBe('user.name');
    expect(keyOfName(undefined)).toBe('');
  });
});

describe('path guards and containers', () => {
  it('checks object shapes', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isObjectRecord([])).toBe(true);
    expect(isObjectLike({})).toBe(true);
    expect(isObjectLike(null)).toBe(false);
  });

  it('checks unsafe object keys', () => {
    expect(isUnsafeKey('__proto__')).toBe(true);
    expect(isUnsafeKey('constructor')).toBe(true);
    expect(isUnsafeKey('prototype')).toBe(true);
    expect(isUnsafeKey('safe')).toBe(false);
  });

  it('creates containers from path segment intent', () => {
    expect(emptyContainer(0)).toEqual([]);
    expect(emptyContainer('profile')).toEqual({});
  });

  it('只把合法的非负整数（含数字字符串）解析成数组下标', () => {
    expect(toArrayIndex(0)).toBe(0);
    expect(toArrayIndex(12)).toBe(12);
    expect(toArrayIndex('0')).toBe(0);
    expect(toArrayIndex('12')).toBe(12);

    expect(toArrayIndex('01')).toBeNull();
    expect(toArrayIndex('foo')).toBeNull();
    expect(toArrayIndex('')).toBeNull();
    expect(toArrayIndex(-1)).toBeNull();
    expect(toArrayIndex(1.5)).toBeNull();
    expect(toArrayIndex(Number.NaN)).toBeNull();
  });
});

describe('path collection', () => {
  it('checks prefix containment for exact, wildcard, and nested paths', () => {
    expect(isUnderPrefix('profile.name', 'profile')).toBe(true);
    expect(isUnderPrefix('profile', 'profile')).toBe(true);
    expect(isUnderPrefix('profileName', 'profile')).toBe(false);
    expect(isUnderPrefix('profile.name', '*')).toBe(true);
    expect(isUnderPrefix('profile.name', '')).toBe(true);
  });

  it('collects deep keys from nested values', () => {
    const date = new Date('2026-05-07T00:00:00.000Z');

    expect(collectDeepKeys({ empty: {}, list: [1], nil: null, profile: { birthday: date, name: 'Alex' } })).toEqual([
      'empty',
      'list.0',
      'nil',
      'profile.birthday',
      'profile.name'
    ]);
  });
});
