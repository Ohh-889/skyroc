import { describe, expect, it } from 'vitest';
import {
  getRecommendedColorPalette,
  getRecommendedColorPaletteFamily,
  getRecommendedPaletteColorByNumber
} from '../../src/palette/recommend';

const HEX_REGEX = /^#[0-9a-f]{6}$/;

// ==================== getRecommendedColorPaletteFamily ====================

describe('getRecommendedColorPaletteFamily', () => {
  it('应返回 11 个调色板', () => {
    const family = getRecommendedColorPaletteFamily('#1890ff');
    expect(family.palettes).toHaveLength(11);
  });

  it('应返回颜色名称', () => {
    const family = getRecommendedColorPaletteFamily('#1890ff');
    expect(family.name).toBeTruthy();
  });

  it('每个调色板应为有效 hex', () => {
    const family = getRecommendedColorPaletteFamily('#1890ff');
    family.palettes.forEach(p => {
      expect(p.hex).toMatch(HEX_REGEX);
    });
  });

  it('无效颜色应抛错', () => {
    expect(() => getRecommendedColorPaletteFamily('invalid')).toThrow();
  });
});

// ==================== getRecommendedColorPalette ====================

describe('getRecommendedColorPalette', () => {
  it('应返回 colorMap', () => {
    const result = getRecommendedColorPalette('#1890ff');
    expect(result.colorMap).toBeInstanceOf(Map);
    expect(result.colorMap.size).toBe(11);
  });

  it('应返回 main（500 色阶）', () => {
    const result = getRecommendedColorPalette('#1890ff');
    expect(result.main).toBeDefined();
    expect(result.main.number).toBe(500);
  });

  it('应返回 match', () => {
    const result = getRecommendedColorPalette('#1890ff');
    expect(result.match).toBeDefined();
    expect(result.match.hex).toMatch(HEX_REGEX);
  });
});

// ==================== getRecommendedPaletteColorByNumber ====================

describe('getRecommendedPaletteColorByNumber', () => {
  it('应返回指定色阶的 hex', () => {
    expect(getRecommendedPaletteColorByNumber('#1890ff', 500)).toMatch(HEX_REGEX);
  });

  it('不同色阶应返回不同颜色', () => {
    const c100 = getRecommendedPaletteColorByNumber('#1890ff', 100);
    const c900 = getRecommendedPaletteColorByNumber('#1890ff', 900);
    expect(c100).not.toBe(c900);
  });

  it('不同输入颜色应生成不同结果', () => {
    const red = getRecommendedPaletteColorByNumber('#ff0000', 500);
    const blue = getRecommendedPaletteColorByNumber('#0000ff', 500);
    expect(red).not.toBe(blue);
  });
});

// ==================== 输入归一化（回归） ====================

describe('推荐算法输入归一化', () => {
  const EQUIVALENT_INPUTS = ['#1677ff', '#1677FF', 'rgb(22, 119, 255)', 'hsl(217, 100%, 54%)'];

  it('大写 hex / rgb / hsl 输入都应产出小写 6 位 hex', () => {
    for (const input of EQUIVALENT_INPUTS) {
      for (const palette of getRecommendedColorPaletteFamily(input).palettes) {
        expect(palette.hex).toMatch(HEX_REGEX);
      }
    }
  });

  it('指向同一颜色的输入应产出完全相同的色板', () => {
    // hsl 字符串经过舍入后并不精确等于 #1677ff，这里只对严格等价的写法做对比
    const expected = getRecommendedColorPaletteFamily('#1677ff').palettes.map(p => p.hex);

    for (const input of ['#1677FF', 'rgb(22, 119, 255)']) {
      expect(getRecommendedColorPaletteFamily(input).palettes.map(p => p.hex)).toEqual(expected);
    }
  });

  it('命名色输入不应把色名字符串泄漏进 hex 字段', () => {
    for (const palette of getRecommendedColorPaletteFamily('red').palettes) {
      expect(palette.hex).toMatch(HEX_REGEX);
    }
  });

  it('match 必须是色板中真实存在的档位', () => {
    for (const input of [...EQUIVALENT_INPUTS, 'red', '#ABCDEF']) {
      const result = getRecommendedColorPalette(input);

      expect(result.match).toBeDefined();
      expect(result.colorMap.get(result.match.number)).toEqual(result.match);
      expect(result.match.hex).toMatch(HEX_REGEX);
    }
  });

  it('输入色应原样出现在其匹配档位上', () => {
    const result = getRecommendedColorPalette('#1677FF');

    expect(result.match.hex).toBe('#1677ff');
  });
});
