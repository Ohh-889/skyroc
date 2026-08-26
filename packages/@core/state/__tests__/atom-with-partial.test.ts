import type { Atom } from 'jotai';
import { createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { atomWithPartial } from '../src/utils/atom-with-partial';

describe('atomWithPartial', () => {
  it('返回初始值', () => {
    const store = createStore();
    const testAtom = atomWithPartial({ a: 1, b: 'hello' });
    expect(store.get(testAtom)).toEqual({ a: 1, b: 'hello' });
  });

  it('内部 atom 标记为私有', () => {
    const testAtom = atomWithPartial({ value: 1 });
    let dependency: Atom<unknown> | undefined;

    testAtom.read(
      <Value>(targetAtom: Atom<Value>) => {
        dependency = targetAtom as Atom<unknown>;
        return (targetAtom as Atom<Value> & { init: Value }).init;
      },
      { setSelf: () => undefined, signal: new AbortController().signal }
    );

    expect(dependency?.debugPrivate).toBe(true);
  });

  it('部分更新只修改指定字段', () => {
    const store = createStore();
    const testAtom = atomWithPartial({ x: 10, y: 20, z: 30 });

    store.set(testAtom, { y: 99 });
    expect(store.get(testAtom)).toEqual({ x: 10, y: 99, z: 30 });
  });

  it('多次合并累积更新', () => {
    const store = createStore();
    const testAtom = atomWithPartial({ a: 1, b: 2, c: 3 });

    store.set(testAtom, { a: 10 });
    store.set(testAtom, { c: 30 });
    expect(store.get(testAtom)).toEqual({ a: 10, b: 2, c: 30 });
  });

  it('空更新保持引用相等（避免无意义重渲染）', () => {
    const store = createStore();
    const testAtom = atomWithPartial({ foo: 'bar' });

    const before = store.get(testAtom);
    store.set(testAtom, {});
    expect(store.get(testAtom)).toBe(before);
  });

  it('值未变更新保持引用相等', () => {
    const store = createStore();
    const testAtom = atomWithPartial({ foo: 'bar', n: 1 });

    const before = store.get(testAtom);
    store.set(testAtom, { foo: 'bar' });
    expect(store.get(testAtom)).toBe(before);
  });

  it('支持 updater function 形式', () => {
    const store = createStore();
    const testAtom = atomWithPartial({ count: 5 });

    store.set(testAtom, prev => ({ count: prev.count + 1 }));
    store.set(testAtom, prev => ({ count: prev.count * 2 }));
    expect(store.get(testAtom)).toEqual({ count: 12 });
  });
});
