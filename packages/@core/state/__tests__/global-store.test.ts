import { atom } from 'jotai';
import { describe, expect, it } from 'vitest';
import { atomWithPartial } from '../src/utils/atom-with-partial';
import { getAtomValue, setAtomValue } from '../src/store/global';

describe('global store', () => {
  it('getAtomValue 读取 atom 初始值', () => {
    const countAtom = atom(0);
    expect(getAtomValue(countAtom)).toBe(0);
  });

  it('setAtomValue 设置 atom 值', () => {
    const countAtom = atom(0);
    setAtomValue(countAtom, 10);
    expect(getAtomValue(countAtom)).toBe(10);
  });

  it('setAtomValue 支持 primitive atom 函数式更新', () => {
    const countAtom = atom(1);
    setAtomValue(countAtom, prev => prev + 1);
    expect(getAtomValue(countAtom)).toBe(2);
  });

  it('setAtomValue 连续函数式调用累积', () => {
    const countAtom = atom(1);
    setAtomValue(countAtom, prev => prev + 1);
    setAtomValue(countAtom, prev => prev + 1);
    setAtomValue(countAtom, prev => prev + 1);
    expect(getAtomValue(countAtom)).toBe(4);
  });

  it('setAtomValue 支持自定义写签名的 atom', () => {
    const uiAtom = atomWithPartial({ mixSiderFixed: false, siderCollapse: false });

    setAtomValue(uiAtom, { siderCollapse: true });
    expect(getAtomValue(uiAtom)).toEqual({ mixSiderFixed: false, siderCollapse: true });

    setAtomValue(uiAtom, prev => ({ siderCollapse: !prev.siderCollapse }));
    expect(getAtomValue(uiAtom)).toEqual({ mixSiderFixed: false, siderCollapse: false });
  });
});
