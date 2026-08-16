import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLocalforage, createStorage } from '../../src/web/storage';

interface TestStorage {
  count: number;
  flag: boolean;
  token: string;
}

const PREFIX = 'test_';

describe('createStorage - localStorage', () => {
  const storage = createStorage<TestStorage>('local', PREFIX);

  afterEach(() => {
    storage.clear();
  });

  it('set/get 应正确存取字符串', () => {
    storage.set('token', 'abc123');
    expect(storage.get('token')).toBe('abc123');
  });

  it('set/get 应正确存取数字', () => {
    storage.set('count', 42);
    expect(storage.get('count')).toBe(42);
  });

  it('set/get 应正确存取布尔值', () => {
    storage.set('flag', false);
    expect(storage.get('flag')).toBe(false);
  });

  it('get 不存在的 key 应返回 null', () => {
    expect(storage.get('token')).toBeNull();
  });

  it('get 读取到 JSON null 时应清理并返回 null', () => {
    window.localStorage.setItem('test_token', 'null');

    expect(storage.get('token')).toBeNull();
    expect(window.localStorage.getItem('test_token')).toBeNull();
  });

  it('remove 应删除指定 key', () => {
    storage.set('token', 'abc');
    storage.remove('token');
    expect(storage.get('token')).toBeNull();
  });

  it('clear 应清空所有数据', () => {
    storage.set('token', 'abc');
    storage.set('count', 1);
    storage.clear();
    expect(storage.get('token')).toBeNull();
    expect(storage.get('count')).toBeNull();
  });

  it('存储的 key 应包含前缀', () => {
    storage.set('token', 'abc');
    expect(window.localStorage.getItem('test_token')).toBe('"abc"');
  });
});

describe('createStorage - sessionStorage', () => {
  const storage = createStorage<TestStorage>('session', PREFIX);

  afterEach(() => {
    storage.clear();
  });

  it('应使用 sessionStorage', () => {
    storage.set('token', 'session_value');
    expect(window.sessionStorage.getItem('test_token')).toBe('"session_value"');
  });

  it('set/get 应正确工作', () => {
    storage.set('count', 99);
    expect(storage.get('count')).toBe(99);
  });
});

// ==================== createLocalforage ====================

describe('createLocalforage', () => {
  it('local driver 应调用 config 并返回 localforage 实例', async () => {
    const localforage = await import('localforage');
    const configSpy = vi.spyOn(localforage.default, 'config');

    const lf = createLocalforage<{ key: string }>('local');

    expect(configSpy).toHaveBeenCalledWith({ driver: localforage.default.LOCALSTORAGE });
    expect(lf).toBeDefined();
    expect(typeof lf.getItem).toBe('function');
    expect(typeof lf.setItem).toBe('function');
    expect(typeof lf.removeItem).toBe('function');

    configSpy.mockRestore();
  });

  it('indexedDB driver 应传入正确的 driver', async () => {
    const localforage = await import('localforage');
    const configSpy = vi.spyOn(localforage.default, 'config');

    createLocalforage<{ key: string }>('indexedDB');

    expect(configSpy).toHaveBeenCalledWith({ driver: localforage.default.INDEXEDDB });

    configSpy.mockRestore();
  });

  it('webSQL driver 应传入正确的 driver', async () => {
    const localforage = await import('localforage');
    const configSpy = vi.spyOn(localforage.default, 'config');

    createLocalforage<{ key: string }>('webSQL');

    expect(configSpy).toHaveBeenCalledWith({ driver: localforage.default.WEBSQL });

    configSpy.mockRestore();
  });
});
