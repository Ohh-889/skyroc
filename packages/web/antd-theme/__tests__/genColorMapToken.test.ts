import { describe, expect, it } from 'vitest';
import {
  ANTD_INDEXES,
  FUNCTIONAL_SEMANTIC_CONFIG,
  PRIMARY_SEMANTIC_CONFIG,
  TAILWIND_INDEXES,
  genPaletteVars,
  genSemanticColors
} from '../src/shared/genColorMapToken';
import type { ColorMap } from '../src/types';

/** 构造测试用 ColorMap（antd 1-10 + tailwind 50-950） */
function makeColorMap(): ColorMap {
  const map: ColorMap = {};
  ANTD_INDEXES.forEach((i, _idx) => {
    map[i] = `#color-${i}` as string;
    // 对应的 tailwind 索引
  });
  TAILWIND_INDEXES.forEach(i => {
    map[i] = `#tw-${i}` as string;
  });
  // 确保 antd 索引和 tailwind 索引均有值
  map[1] = '#tw-50';
  map[2] = '#tw-100';
  map[3] = '#tw-200';
  map[4] = '#tw-300';
  map[5] = '#tw-400';
  map[6] = '#tw-500';
  map[7] = '#tw-600';
  map[8] = '#tw-700';
  map[9] = '#tw-800';
  map[10] = '#tw-900';
  return map;
}

describe('genPaletteVars', () => {
  it('应生成 AntD 内部使用的 name1 到 name10', () => {
    const map = makeColorMap();
    const result = genPaletteVars('blue', map);

    for (const i of ANTD_INDEXES) {
      expect(result[`blue${i}`]).toBe(map[i]);
    }
  });

  it('应生成项目调色板使用的 name-1 到 name-10', () => {
    const map = makeColorMap();
    const result = genPaletteVars('colorPrimary', map);

    for (const i of ANTD_INDEXES) {
      expect(result).toHaveProperty(`primary-${i}`);
    }
  });

  it('应生成 tailwind 格式 name-50 到 name-950', () => {
    const map = makeColorMap();
    const result = genPaletteVars('colorPrimary', map);

    for (const i of TAILWIND_INDEXES) {
      expect(result).toHaveProperty(`primary-${i}`);
    }
  });

  it('color 前缀应被去掉', () => {
    const map = makeColorMap();
    const result = genPaletteVars('colorPrimary', map);

    expect(result).not.toHaveProperty('colorprimary-1');
    expect(result).toHaveProperty('primary-1');
  });

  it('无 color 前缀的名称（如 blue）应保持原名', () => {
    const map = makeColorMap();
    const result = genPaletteVars('blue', map);

    expect(result).toHaveProperty('blue-1');
    expect(result).toHaveProperty('blue-500');
  });

  it('名称首字母应小写（normalizeColorName）', () => {
    const map = makeColorMap();
    const result = genPaletteVars('colorInfo', map);

    expect(result).toHaveProperty('info-1');
    expect(result).not.toHaveProperty('Info-1');
  });

  it('colorMap 中缺失的索引应回退为空字符串', () => {
    const emptyMap: ColorMap = {};
    const result = genPaletteVars('blue', emptyMap);

    // 所有 antd 和 tailwind 索引均应存在，值为空字符串
    for (const i of ANTD_INDEXES) {
      expect(result[`blue${i}`]).toBe('');
      expect(result[`blue-${i}`]).toBe('');
    }
    for (const i of TAILWIND_INDEXES) {
      expect(result[`blue-${i}`]).toBe('');
    }
  });
});

describe('genSemanticColors', () => {
  it('使用 PRIMARY_SEMANTIC_CONFIG 应生成 10 个语义色键', () => {
    const map = makeColorMap();
    const result = genSemanticColors({ colors: map, config: PRIMARY_SEMANTIC_CONFIG, name: 'primary' });

    const expectedKeys = [
      'colorprimary',
      'colorprimaryActive',
      'colorprimaryBg',
      'colorprimaryBgHover',
      'colorprimaryBorder',
      'colorprimaryBorderHover',
      'colorprimaryHover',
      'colorprimaryText',
      'colorprimaryTextActive',
      'colorprimaryTextHover'
    ];
    for (const key of expectedKeys) {
      expect(result).toHaveProperty(key);
    }
  });

  it('name 以 Color 开头时应额外生成驼峰小写版本', () => {
    const map = makeColorMap();
    const result = genSemanticColors({ colors: map, config: FUNCTIONAL_SEMANTIC_CONFIG, name: 'ColorPrimary' });

    // 额外的 lowercase 版本
    expect(result).toHaveProperty('primary');
    // 标准版本
    expect(result).toHaveProperty('colorPrimary');
  });

  it('name 不以 Color 开头时不应生成额外键', () => {
    const map = makeColorMap();
    const result = genSemanticColors({ colors: map, config: PRIMARY_SEMANTIC_CONFIG, name: 'primary' });

    // 不应有未带 color 前缀的独立键
    expect(result).not.toHaveProperty('primary');
  });

  it('语义色的值应来自对应的 colors[config.xxx] 索引', () => {
    const map = makeColorMap();
    const result = genSemanticColors({ colors: map, config: PRIMARY_SEMANTIC_CONFIG, name: 'primary' });

    expect(result['colorprimary']).toBe(map[PRIMARY_SEMANTIC_CONFIG.main]);
    expect(result['colorprimaryActive']).toBe(map[PRIMARY_SEMANTIC_CONFIG.active]);
    expect(result['colorprimaryBg']).toBe(map[PRIMARY_SEMANTIC_CONFIG.bg]);
    expect(result['colorprimaryHover']).toBe(map[PRIMARY_SEMANTIC_CONFIG.hover]);
  });

  it('FUNCTIONAL_SEMANTIC_CONFIG hover 与 PRIMARY 不同（4 vs 5）', () => {
    expect(FUNCTIONAL_SEMANTIC_CONFIG.hover).toBe(4);
    expect(PRIMARY_SEMANTIC_CONFIG.hover).toBe(5);
  });
});
