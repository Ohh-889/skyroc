import { beforeEach, describe, expect, it } from 'vitest';
import type { AtomStorage } from '../src/types';
import {
  __clearStorageRegistry,
  getStorage,
  hasStorage,
  registerStorage,
  unregisterStorage
} from '../src/utils/storage-registry';

function createMockStorage(): AtomStorage {
  const store = new Map<string, unknown>();
  return {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: key => store.delete(key)
  };
}

describe('storage-registry', () => {
  beforeEach(() => {
    __clearStorageRegistry();
  });

  it('注册后可正常获取存储', () => {
    const mock = createMockStorage();
    registerStorage('reg-get-test', mock);
    expect(getStorage('reg-get-test')).toBe(mock);
  });

  it('未注册的名称抛出错误', () => {
    expect(() => getStorage('not-registered')).toThrowError('[core-state] Storage "not-registered" is not registered');
  });

  it('同名注册会覆盖前一个', () => {
    const first = createMockStorage();
    const second = createMockStorage();
    registerStorage('override-test', first);
    registerStorage('override-test', second);
    expect(getStorage('override-test')).toBe(second);
  });

  it('不同名称互不影响', () => {
    const a = createMockStorage();
    const b = createMockStorage();
    registerStorage('iso-a', a);
    registerStorage('iso-b', b);
    expect(getStorage('iso-a')).toBe(a);
    expect(getStorage('iso-b')).toBe(b);
    expect(getStorage('iso-a')).not.toBe(b);
  });

  it('hasStorage 返回是否已注册', () => {
    registerStorage('has-test', createMockStorage());
    expect(hasStorage('has-test')).toBe(true);
    expect(hasStorage('not-registered-yet')).toBe(false);
  });

  it('unregisterStorage 移除注册并返回是否存在', () => {
    registerStorage('un-test', createMockStorage());
    expect(unregisterStorage('un-test')).toBe(true);
    expect(hasStorage('un-test')).toBe(false);
    expect(unregisterStorage('un-test')).toBe(false);
  });

  it('__clearStorageRegistry 清空全部', () => {
    registerStorage('clear-1', createMockStorage());
    registerStorage('clear-2', createMockStorage());
    __clearStorageRegistry();
    expect(hasStorage('clear-1')).toBe(false);
    expect(hasStorage('clear-2')).toBe(false);
  });
});
