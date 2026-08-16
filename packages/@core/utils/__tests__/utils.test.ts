import { describe, expect, it, vi } from 'vitest';
import { isHttpUrl, isNil, microtask, noop, omitUndefined } from '../src/utils';

// ==================== noop ====================

describe('noop', () => {
  it('应返回 undefined', () => {
    expect(noop()).toBeUndefined();
  });
});

// ==================== isNil ====================

describe('isNil', () => {
  it('null 应返回 true', () => {
    expect(isNil(null)).toBe(true);
  });

  it('undefined 应返回 true', () => {
    expect(isNil(undefined)).toBe(true);
  });

  it('0 应返回 false', () => {
    expect(isNil(0)).toBe(false);
  });

  it('空字符串应返回 false', () => {
    expect(isNil('')).toBe(false);
  });

  it('false 应返回 false', () => {
    expect(isNil(false)).toBe(false);
  });

  it('空对象应返回 false', () => {
    expect(isNil({})).toBe(false);
  });
});

// ==================== isHttpUrl ====================

describe('isHttpUrl', () => {
  it('http URL 应返回 true', () => {
    expect(isHttpUrl('http://example.com')).toBe(true);
  });

  it('https URL 应返回 true', () => {
    expect(isHttpUrl('https://example.com')).toBe(true);
  });

  it('带路径的 URL 应返回 true', () => {
    expect(isHttpUrl('https://example.com/path?q=1')).toBe(true);
  });

  it('ftp 协议应返回 false', () => {
    expect(isHttpUrl('ftp://example.com')).toBe(false);
  });

  it('无协议应返回 false', () => {
    expect(isHttpUrl('example.com')).toBe(false);
  });

  it('空字符串应返回 false', () => {
    expect(isHttpUrl('')).toBe(false);
  });

  it('undefined 应返回 false', () => {
    expect(isHttpUrl(undefined)).toBe(false);
  });
});

describe('omitUndefined', () => {
  it('应只移除值为 undefined 的字段', () => {
    expect(
      omitUndefined({
        empty: '',
        falseValue: false,
        nil: null,
        skip: undefined,
        zero: 0
      })
    ).toEqual({
      empty: '',
      falseValue: false,
      nil: null,
      zero: 0
    });
  });
});

// ==================== microtask ====================

describe('microtask', () => {
  it('回调异步执行，且早于宏任务', async () => {
    const calls: string[] = [];

    microtask(() => calls.push('micro'));
    setTimeout(() => calls.push('macro'), 0);

    expect(calls).toEqual([]);

    await Promise.resolve();

    expect(calls).toEqual(['micro']);
  });

  it('宿主没有 queueMicrotask 时回退到 Promise', async () => {
    vi.stubGlobal('queueMicrotask', undefined);
    vi.resetModules();

    const { microtask: fallback } = await import('../src/utils');
    const calls: string[] = [];

    fallback(() => calls.push('flushed'));
    expect(calls).toEqual([]);

    await Promise.resolve();
    expect(calls).toEqual(['flushed']);

    vi.unstubAllGlobals();
    vi.resetModules();
  });
});
