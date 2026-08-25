import { describe, expect, it } from 'vitest';

import { azir, compact, dark, defaultPreset, getAllPresets, getPreset, presets, shadcn } from '@shell/theme/presets';

describe('presets', () => {
  it('包含 5 个内置预设', () => {
    expect(Object.keys(presets).toSorted()).toEqual(['azir', 'compact', 'dark', 'default', 'shadcn']);
  });

  it('每个预设有 name / order 字段', () => {
    for (const value of Object.values(presets)) {
      expect(value).toHaveProperty('name');
      expect(typeof (value as any).order).toBe('number');
    }
  });

  it('具名导出与 presets 中的引用一致', () => {
    expect(presets.default).toBe(defaultPreset);
    expect(presets.dark).toBe(dark);
    expect(presets.shadcn).toBe(shadcn);
    expect(presets.azir).toBe(azir);
    expect(presets.compact).toBe(compact);
  });
});

describe('getPreset', () => {
  it('按名称返回对应预设', () => {
    expect(getPreset('default')).toBe(presets.default);
    expect(getPreset('dark')).toBe(presets.dark);
    expect(getPreset('shadcn')).toBe(presets.shadcn);
  });
});

describe('getAllPresets', () => {
  it('返回全部 5 个预设，按 order 升序', () => {
    const all = getAllPresets();

    expect(all).toHaveLength(5);
    expect(all[0]).toBe(presets.default);
    expect(all.at(-1)).toBe(presets.compact);
  });

  it('order 字段单调不下降', () => {
    const orders = getAllPresets().map(p => (p as any).order ?? 0);

    for (let i = 1; i < orders.length; i += 1) {
      expect(orders[i]).toBeGreaterThanOrEqual(orders[i - 1]);
    }
  });
});
