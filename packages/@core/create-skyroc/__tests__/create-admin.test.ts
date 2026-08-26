import { describe, expect, it } from 'vitest';

import { normalizePackageName, replaceEnvValue, toStoragePrefix, toTitle } from '../src/scaffold/create-admin';

describe('normalizePackageName', () => {
  it.each([
    ['My Admin', 'my-admin'],
    ['my_admin', 'my-admin'],
    ['@scope/my-admin', '@scope/my-admin'],
    ['my.admin', 'my.admin']
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizePackageName(input)).toBe(expected);
  });

  it.each([['  '], ['///'], ['@/']])('rejects %s', input => {
    expect(() => normalizePackageName(input)).toThrow();
  });
});

describe('toTitle', () => {
  it.each([
    ['my-admin', 'My Admin'],
    ['@scope/demo-shop', 'Demo Shop'],
    ['admin', 'Admin']
  ])('%s -> %s', (input, expected) => {
    expect(toTitle(input)).toBe(expected);
  });
});

describe('toStoragePrefix', () => {
  it.each([
    ['demo-shop', 'DEMO_SHOP_'],
    ['@scope/demo-shop', 'DEMO_SHOP_'],
    ['---', 'ADMIN_']
  ])('%s -> %s', (input, expected) => {
    expect(toStoragePrefix(input)).toBe(expected);
  });
});

describe('replaceEnvValue', () => {
  it('replaces an existing key in place', () => {
    expect(replaceEnvValue('A=1\nB=2\n', 'B', '3')).toBe('A=1\nB=3\n');
  });

  it('appends a key that is absent', () => {
    expect(replaceEnvValue('A=1\n', 'B', '2')).toBe('A=1\nB=2\n');
  });

  it('only replaces at line starts, not inside other values', () => {
    expect(replaceEnvValue('PREFIX_A=1\nA=2\n', 'A', '9')).toBe('PREFIX_A=1\nA=9\n');
  });

  it('escapes backslashes and quotes', () => {
    expect(replaceEnvValue('A=1\n', 'A', String.raw`c:\x"y`)).toBe(`${String.raw`A=c:\\x\"y`}\n`);
  });
});
