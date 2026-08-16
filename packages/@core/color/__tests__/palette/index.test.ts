import { describe, expect, it } from 'vitest';
import { getAntDColorPalette, getColorPalette, getHex, getPaletteColorByNumber } from '../../src/index';

const HEX_REGEX = /^#[0-9a-f]{6}$/;

function hasDifference(a: Map<any, string>, b: Map<any, string>) {
  let diff = false;
  a.forEach((hex, number) => {
    if (hex !== b.get(number)) {
      diff = true;
    }
  });
  return diff;
}

// ==================== getColorPalette ====================

describe('getColorPalette', () => {
  it('默认（AntD）模式应返回 11 个颜色', () => {
    const map = getColorPalette('#1890ff');
    expect(map.size).toBe(11);
  });

  it('推荐模式应返回 11 个颜色', () => {
    const map = getColorPalette('#1890ff', 'recommended');
    expect(map.size).toBe(11);
  });

  it('OKLCH 模式应返回 11 个颜色', () => {
    const map = getColorPalette('#1890ff', 'oklch');
    expect(map.size).toBe(11);
  });

  it('所有颜色应为有效 hex', () => {
    const map = getColorPalette('#1890ff');
    map.forEach(hex => {
      expect(hex).toMatch(HEX_REGEX);
    });
  });

  it('应包含所有标准色阶', () => {
    const map = getColorPalette('#1890ff');
    const expectedNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    expectedNumbers.forEach(n => {
      expect(map.has(n as any)).toBe(true);
    });
  });

  it('三种算法应返回不同结果', () => {
    const antd = getColorPalette('#1890ff', 'antd');
    const recommended = getColorPalette('#1890ff', 'recommended');
    const oklch = getColorPalette('#1890ff', 'oklch');

    expect(hasDifference(antd, recommended)).toBe(true);
    expect(hasDifference(antd, oklch)).toBe(true);
    expect(hasDifference(recommended, oklch)).toBe(true);
  });
});

// ==================== getPaletteColorByNumber ====================

describe('getPaletteColorByNumber', () => {
  it('应返回有效 hex', () => {
    expect(getPaletteColorByNumber('#1890ff', 500)).toMatch(HEX_REGEX);
  });

  it('推荐模式应返回有效 hex', () => {
    expect(getPaletteColorByNumber('#1890ff', 500, 'recommended')).toMatch(HEX_REGEX);
  });

  it('OKLCH 模式应返回有效 hex', () => {
    expect(getPaletteColorByNumber('#1890ff', 500, 'oklch')).toMatch(HEX_REGEX);
  });

  it('不同色阶应返回不同颜色', () => {
    const c50 = getPaletteColorByNumber('#1890ff', 50);
    const c950 = getPaletteColorByNumber('#1890ff', 950);
    expect(c50).not.toBe(c950);
  });
});

// ==================== antd 暗色色板 & 入口导出（回归） ====================

describe('antd 暗色色板', () => {
  it('darkTheme 选项应产出不同色板', () => {
    const light = getColorPalette('#1890ff', 'antd');
    const dark = getColorPalette('#1890ff', { algorithm: 'antd', darkTheme: true });

    expect(dark.size).toBe(11);
    expect(hasDifference(light, dark)).toBe(true);
  });

  it('darkThemeMixColor 应影响结果', () => {
    const a = getColorPalette('#1890ff', { algorithm: 'antd', darkTheme: true });
    const b = getColorPalette('#1890ff', { algorithm: 'antd', darkTheme: true, darkThemeMixColor: '#000000' });

    expect(hasDifference(a, b)).toBe(true);
  });

  it('getPaletteColorByNumber 应透传配置对象', () => {
    const light = getPaletteColorByNumber('#1890ff', 100, 'antd');
    const dark = getPaletteColorByNumber('#1890ff', 100, { algorithm: 'antd', darkTheme: true });

    expect(dark).toMatch(HEX_REGEX);
    expect(dark).not.toBe(light);
  });
});

describe('包入口导出', () => {
  it('README 中记载的 antd API 应可从入口导入', async () => {
    const api = await import('../../src/index');

    expect(typeof api.getAntDColorPalette).toBe('function');
    expect(typeof api.getAntDPaletteColorByIndex).toBe('function');
    expect(typeof api.getRecommendedColorPaletteFamily).toBe('function');
    expect(typeof api.generateOklchPaletteAnchored).toBe('function');
    expect(typeof api.colorNameMap).toBe('object');
  });

  it('三种算法都应接受非 hex 输入并产出小写 hex', () => {
    for (const algorithm of ['antd', 'recommended', 'oklch'] as const) {
      getColorPalette('rgb(24, 144, 255)', algorithm).forEach(hex => {
        expect(hex).toMatch(HEX_REGEX);
      });
    }
  });
});

// ==================== 输入精度（回归） ====================

describe('antd 算法的输入精度', () => {
  // tailwind-plugin 传进来的正是这种 hsl 字符串，精度高于 8bit hex。
  // 若在 antd 分支多做一次 getHex 归一化，会先截断到 8bit 再转 HSV，派生档位偏移 1-2。
  const HSL_INPUTS = [
    'hsl(237, 100%, 70%)',
    'hsl(228.6, 84.2%, 4.9%)',
    'hsl(215.4, 16.3%, 46.9%)',
    'hsl(217.2, 32.6%, 17.5%)',
    'hsl(210, 40%, 96.1%)',
    'hsl(222.2, 47.4%, 11.2%)'
  ];

  it('不得对输入做有损归一化', () => {
    for (const input of HSL_INPUTS) {
      const viaEntry = [...getColorPalette(input).values()];
      const direct = getAntDColorPalette(input);

      expect(viaEntry).toEqual(direct);
    }
  });

  it('至少有一个样本能证明多转一次 hex 会丢精度', () => {
    const lossy = HSL_INPUTS.filter(
      input => getAntDColorPalette(input).join() !== getAntDColorPalette(getHex(input)).join()
    );

    expect(lossy.length).toBeGreaterThan(0);
  });
});
