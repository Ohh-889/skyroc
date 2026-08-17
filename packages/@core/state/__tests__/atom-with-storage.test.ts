import { createStore } from 'jotai';
import { RESET } from 'jotai/utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AtomStorage } from '../src/types';
import { createAtomWithStorage } from '../src/utils/atom-with-storage';
import { __clearStorageRegistry, registerStorage } from '../src/utils/storage-registry';

function createMockStorage(initial?: Record<string, unknown>): AtomStorage {
  const store = new Map<string, unknown>(Object.entries(initial ?? {}));
  return {
    getItem: key => store.get(key) ?? null,
    removeItem: key => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, value);
    }
  };
}

afterEach(() => {
  __clearStorageRegistry();
  vi.restoreAllMocks();
});

describe('createAtomWithStorage', () => {
  it('无已有数据时返回初始值', () => {
    registerStorage('aws-init', createMockStorage());

    const store = createStore();
    const testAtom = createAtomWithStorage('key1', 42, { storageName: 'aws-init' });
    expect(store.get(testAtom)).toBe(42);
  });

  it('从 storage 读取已有值', () => {
    registerStorage('aws-read', createMockStorage({ 'persisted-key': 'saved-value' }));

    const store = createStore();
    const testAtom = createAtomWithStorage('persisted-key', 'default', { storageName: 'aws-read' });
    expect(store.get(testAtom)).toBe('saved-value');
  });

  it('写入值同步到 storage', () => {
    const mock = createMockStorage();
    registerStorage('aws-write', mock);

    const store = createStore();
    const testAtom = createAtomWithStorage('write-key', 'initial', { storageName: 'aws-write' });

    store.set(testAtom, 'updated');
    expect(mock.getItem('write-key')).toBe('updated');
  });

  it('支持 updater 函数形式写入', () => {
    const mock = createMockStorage({ counter: 1 });
    registerStorage('aws-updater', mock);

    const store = createStore();
    const testAtom = createAtomWithStorage('counter', 0, { storageName: 'aws-updater' });

    store.set(testAtom, prev => prev + 10);
    expect(store.get(testAtom)).toBe(11);
    expect(mock.getItem('counter')).toBe(11);
  });

  it('直传 storage 绕过 registry', () => {
    const directMock = createMockStorage({ 'direct-key': 99 });

    const store = createStore();
    const testAtom = createAtomWithStorage('direct-key', 0, { storage: directMock });
    expect(store.get(testAtom)).toBe(99);
  });

  it('模块顶层定义、事后注册 storage 仍能读到持久化值', () => {
    // 复现真实使用姿势：atom 是模块级常量，ESM 会在应用入口执行 registerStorage 之前求值
    const lateAtom = createAtomWithStorage('late-key', 'fallback', { storageName: 'aws-late' });

    registerStorage('aws-late', createMockStorage({ 'late-key': 'persisted' }));

    const store = createStore();
    expect(store.get(lateAtom)).toBe('persisted');
  });

  it('storage 未注册时回退到初始值而非抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const orphanAtom = createAtomWithStorage('orphan-key', 'fallback', { storageName: 'aws-never-registered' });

    const store = createStore();
    expect(store.get(orphanAtom)).toBe('fallback');
    expect(warn).toHaveBeenCalled();
  });

  it('storage 未注册时订阅退化为空操作', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const orphanAtom = createAtomWithStorage('orphan-sub-key', 'fallback', { storageName: 'aws-orphan-sub' });

    const store = createStore();
    const unsubscribe = store.sub(orphanAtom, () => {});

    expect(store.get(orphanAtom)).toBe('fallback');
    expect(() => unsubscribe()).not.toThrow();
  });

  it('removeItem 从 storage 中删除键', () => {
    const mock = createMockStorage({ 'rm-key': 'to-delete' });
    registerStorage('aws-rm', mock);

    const store = createStore();
    const testAtom = createAtomWithStorage('rm-key', 'default', { storageName: 'aws-rm' });

    // jotai atomWithStorage uses RESET symbol to trigger removeItem
    store.set(testAtom, RESET);
    expect(mock.getItem('rm-key')).toBeNull();
  });

  it('storage 适配器返回 object 时直接使用，不做二次反序列化', () => {
    registerStorage('aws-object', {
      getItem: () => ({ deep: { nested: 'value' } }),
      removeItem: () => {},
      setItem: () => {}
    });

    const store = createStore();
    const testAtom = createAtomWithStorage<{ deep: { nested: string } }>(
      'obj-key',
      { deep: { nested: 'fallback' } },
      { storageName: 'aws-object' }
    );
    expect(store.get(testAtom)).toEqual({ deep: { nested: 'value' } });
  });

  it('storage.subscribe 接通：外部变更可推送到 atom', () => {
    let listener: ((value: unknown) => void) | undefined;
    registerStorage('aws-sub', {
      getItem: () => null,
      removeItem: () => {},
      setItem: () => {},
      subscribe: (_key, callback) => {
        listener = callback;
        return () => {
          listener = undefined;
        };
      }
    });

    const store = createStore();
    const testAtom = createAtomWithStorage('sub-key', 'init', { storageName: 'aws-sub' });

    const seen: string[] = [];
    const unsubscribe = store.sub(testAtom, () => {
      seen.push(store.get(testAtom));
    });

    expect(listener).toBeTypeOf('function');
    listener?.('externally-changed');
    expect(seen).toContain('externally-changed');

    unsubscribe();
  });

  it('适配器没有 subscribe 时订阅退化为空操作', () => {
    registerStorage('aws-no-sub', createMockStorage({ 'no-sub-key': 'stored' }));

    const store = createStore();
    const testAtom = createAtomWithStorage('no-sub-key', 'fallback', { storageName: 'aws-no-sub' });

    const unsubscribe = store.sub(testAtom, () => {});
    expect(store.get(testAtom)).toBe('stored');
    expect(() => unsubscribe()).not.toThrow();
  });

  it('无 storageName 时默认使用 local', () => {
    registerStorage('local', createMockStorage({ 'local-default-key': 'local-val' }));

    const store = createStore();
    const testAtom = createAtomWithStorage('local-default-key', 'fallback');
    expect(store.get(testAtom)).toBe('local-val');
  });

  it('storage.getItem 抛出异常时回退到初始值', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    registerStorage('aws-throw', {
      getItem: () => {
        throw new Error('corrupt data');
      },
      removeItem: () => {},
      setItem: () => {}
    });

    const store = createStore();
    const testAtom = createAtomWithStorage('throw-key', 'fallback', { storageName: 'aws-throw' });
    expect(store.get(testAtom)).toBe('fallback');
  });

  it('storage.setItem 抛出异常时不影响 atom 写入', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    registerStorage('aws-quota', {
      getItem: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new Error('QuotaExceededError');
      }
    });

    const store = createStore();
    const testAtom = createAtomWithStorage('quota-key', 'initial', { storageName: 'aws-quota' });

    expect(() => store.set(testAtom, 'updated')).not.toThrow();
    expect(store.get(testAtom)).toBe('updated');
    expect(warn).toHaveBeenCalled();
  });

  it('storage.removeItem 抛出异常时不影响 RESET', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    registerStorage('aws-rm-throw', {
      getItem: () => 'stored',
      removeItem: () => {
        throw new Error('remove failed');
      },
      setItem: () => {}
    });

    const store = createStore();
    const testAtom = createAtomWithStorage('rm-throw-key', 'initial', { storageName: 'aws-rm-throw' });

    expect(() => store.set(testAtom, RESET)).not.toThrow();
    expect(store.get(testAtom)).toBe('initial');
  });

  it('storage.subscribe 收到 null 时回退到 initialValue', () => {
    let listener: ((value: unknown) => void) | undefined;
    registerStorage('aws-sub-null', {
      getItem: () => 'stored',
      removeItem: () => {},
      setItem: () => {},
      subscribe: (_key, callback) => {
        listener = callback;
        return () => {};
      }
    });

    const store = createStore();
    const testAtom = createAtomWithStorage('sub-null-key', 'fallback', { storageName: 'aws-sub-null' });

    const seen: string[] = [];
    store.sub(testAtom, () => {
      seen.push(store.get(testAtom));
    });

    listener?.(null);
    expect(seen).toContain('fallback');
  });

  it('validate 拒绝结构漂移的持久化数据', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    registerStorage('aws-validate', createMockStorage({ 'validate-key': { legacyShape: true } }));

    const store = createStore();
    const testAtom = createAtomWithStorage<{ mode: string }>(
      'validate-key',
      { mode: 'light' },
      {
        storageName: 'aws-validate',
        validate: raw => (typeof (raw as { mode?: unknown })?.mode === 'string' ? (raw as { mode: string }) : undefined)
      }
    );

    expect(store.get(testAtom)).toEqual({ mode: 'light' });
  });

  it('validate 通过时使用持久化数据', () => {
    registerStorage('aws-validate-ok', createMockStorage({ 'ok-key': { mode: 'dark' } }));

    const store = createStore();
    const testAtom = createAtomWithStorage<{ mode: string }>(
      'ok-key',
      { mode: 'light' },
      {
        storageName: 'aws-validate-ok',
        validate: raw => (typeof (raw as { mode?: unknown })?.mode === 'string' ? (raw as { mode: string }) : undefined)
      }
    );

    expect(store.get(testAtom)).toEqual({ mode: 'dark' });
  });

  it('同名 storage 下重复 key 会告警', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    registerStorage('aws-dup', createMockStorage());

    createAtomWithStorage('dup-key', 1, { storageName: 'aws-dup' });
    createAtomWithStorage('dup-key', 2, { storageName: 'aws-dup' });

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('already bound to another atom'));
  });

  it('getOnInit false 时挂载前不读 storage', () => {
    registerStorage('aws-no-init', createMockStorage({ 'lazy-key': 'stored' }));

    const store = createStore();
    const testAtom = createAtomWithStorage('lazy-key', 'fallback', {
      getOnInit: false,
      storageName: 'aws-no-init'
    });

    expect(store.get(testAtom)).toBe('fallback');

    // 挂载后 jotai 会重新读取一次
    store.sub(testAtom, () => {});
    expect(store.get(testAtom)).toBe('stored');
  });
});
