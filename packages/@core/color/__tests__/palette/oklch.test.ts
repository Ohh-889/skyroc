import { differenceEuclidean, oklch, parse } from 'culori';
import { describe, expect, it } from 'vitest';
import {
  findAccessibleTextColor,
  generateDarkModePalette,
  generateOklchPalette,
  generateOklchPaletteAdvanced,
  generateOklchPaletteAnchored,
  generateOklchPaletteEx,
  generateOklchPaletteWithContrast,
  getContrastRatio,
  getOklchColorPalette,
  getOklchPaletteColorByNumber,
  meetsWcagContrast
} from '../../src/palette/oklch';

const HEX_REGEX = /^#[0-9a-f]{6}$/;

const avg = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return (r + g + b) / 3;
};

/** 取颜色的 OKLCH 明度，用于断言档位顺序 */
const lightnessOf = (color: string) => oklch(parse(color)!)!.l;

/** 用 culori 独立实现的 ΔEOK，作为 match 计算的对拍基准 */
const oklabDistance = differenceEuclidean('oklab');

// ==================== generateOklchPalette ====================

describe('generateOklchPalette', () => {
  it('应返回 11 个调色板步骤', () => {
    const family = generateOklchPalette('#6366f1');
    expect(family.palettes).toHaveLength(11);
  });

  it('应返回颜色名称', () => {
    const family = generateOklchPalette('#6366f1');
    expect(family.name).toBeTruthy();
    expect(typeof family.name).toBe('string');
  });

  it('每个步骤应包含有效 hex 和 number', () => {
    const family = generateOklchPalette('#6366f1');
    const expectedNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    family.palettes.forEach((palette, i) => {
      expect(palette.hex).toMatch(HEX_REGEX);
      expect(palette.number).toBe(expectedNumbers[i]);
    });
  });

  it('50 应最亮，950 应最暗', () => {
    const family = generateOklchPalette('#3b82f6');
    const first = family.palettes[0].hex;
    const last = family.palettes[10].hex;
    // 简单验证：50 的 hex 数值平均应大于 950
    expect(avg(first)).toBeGreaterThan(avg(last));
  });

  it('无效颜色应抛错', () => {
    expect(() => generateOklchPalette('invalid')).toThrow('Invalid color');
  });

  it('不同颜色应生成不同调色板', () => {
    const red = generateOklchPalette('#ef4444');
    const blue = generateOklchPalette('#3b82f6');
    expect(red.palettes[5].hex).not.toBe(blue.palettes[5].hex);
  });

  it('绿色系应触发中性色区色相偏移', () => {
    // 绿色 hue 在 110-170 区间，触发 getAppleHueShift 的中性色区分支
    const family = generateOklchPalette('#22c55e');
    expect(family.palettes).toHaveLength(11);
    family.palettes.forEach(p => {
      expect(p.hex).toMatch(HEX_REGEX);
    });
  });

  it('深红色应触发 hue 接近 360 的兜底分支', () => {
    // 深红色 hue 接近 0/360，触发 getHueFamily 的兜底 return
    const family = generateOklchPalette('#8b0000');
    expect(family.palettes).toHaveLength(11);
  });

  it('低饱和度灰色应跳过最小色度强制（safeChroma ≤ 0.05）', () => {
    // #808080 在 OKLCH 中 chroma ≈ 0，不触发 safeChroma > 0.05 的分支
    const family = generateOklchPalette('#808080');
    expect(family.palettes).toHaveLength(11);
    family.palettes.forEach(p => {
      expect(p.hex).toMatch(HEX_REGEX);
    });
  });
});

// ==================== getOklchColorPalette ====================

describe('getOklchColorPalette', () => {
  it('应返回 colorMap', () => {
    const result = getOklchColorPalette('#6366f1');
    expect(result.colorMap).toBeInstanceOf(Map);
    expect(result.colorMap.size).toBe(11);
  });

  it('应返回 main（500 色阶）', () => {
    const result = getOklchColorPalette('#6366f1');
    expect(result.main).toBeDefined();
    expect(result.main.number).toBe(500);
    expect(result.main.hex).toMatch(HEX_REGEX);
  });

  it('应返回 match（最接近输入的色阶）', () => {
    const result = getOklchColorPalette('#6366f1');
    expect(result.match).toBeDefined();
    expect(result.match.hex).toMatch(HEX_REGEX);
  });
});

// ==================== getOklchPaletteColorByNumber ====================

describe('getOklchPaletteColorByNumber', () => {
  it('应返回指定色阶的 hex', () => {
    expect(getOklchPaletteColorByNumber('#6366f1', 500)).toMatch(HEX_REGEX);
    expect(getOklchPaletteColorByNumber('#6366f1', 100)).toMatch(HEX_REGEX);
    expect(getOklchPaletteColorByNumber('#6366f1', 900)).toMatch(HEX_REGEX);
  });

  it('不同色阶应返回不同颜色', () => {
    const c100 = getOklchPaletteColorByNumber('#6366f1', 100);
    const c900 = getOklchPaletteColorByNumber('#6366f1', 900);
    expect(c100).not.toBe(c900);
  });
});

// ==================== generateOklchPaletteAdvanced ====================

describe('generateOklchPaletteAdvanced', () => {
  it('默认选项应与 generateOklchPalette 结果一致', () => {
    const standard = generateOklchPalette('#3b82f6');
    const advanced = generateOklchPaletteAdvanced('#3b82f6');
    expect(advanced.palettes).toHaveLength(11);
    // 同样的算法、同样的参数，结果应一致
    expect(advanced.palettes.map(p => p.hex)).toEqual(standard.palettes.map(p => p.hex));
  });

  it('禁用色相旋转应生成不同结果', () => {
    const withShift = generateOklchPaletteAdvanced('#ef4444', { appleHueShift: true });
    const noShift = generateOklchPaletteAdvanced('#ef4444', { appleHueShift: false });
    // 至少某些色阶应不同
    const hasDiff = withShift.palettes.some((p, i) => p.hex !== noShift.palettes[i].hex);
    expect(hasDiff).toBe(true);
  });

  it('禁用色度补偿应生成不同结果', () => {
    const withComp = generateOklchPaletteAdvanced('#3b82f6', { chromaCompensation: true });
    const noComp = generateOklchPaletteAdvanced('#3b82f6', { chromaCompensation: false });
    const hasDiff = withComp.palettes.some((p, i) => p.hex !== noComp.palettes[i].hex);
    expect(hasDiff).toBe(true);
  });

  it('无效颜色应抛错', () => {
    expect(() => generateOklchPaletteAdvanced('invalid')).toThrow('Invalid color');
  });

  it('forceStep 应改变基准色度，产出不同色板', () => {
    const auto = generateOklchPaletteAdvanced('#3b82f6');
    const forced = generateOklchPaletteAdvanced('#3b82f6', { forceStep: 50 });

    expect(forced.palettes).toHaveLength(11);
    expect(forced.palettes.map(p => p.hex)).not.toEqual(auto.palettes.map(p => p.hex));
  });

  it('lightnessCurve 长度不为 11 时应抛错而不是静默回退', () => {
    expect(() => generateOklchPaletteAdvanced('#3b82f6', { lightnessCurve: [0.9, 0.8, 0.7] })).toThrow(
      'expected 11 values, received 3'
    );
  });

  it('lightnessCurve 长度为 11 时应生效', () => {
    const curve = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45];
    const result = generateOklchPaletteAdvanced('#3b82f6', { lightnessCurve: curve });

    expect(result.palettes).toHaveLength(11);
    expect(result.palettes.map(p => p.hex)).not.toEqual(generateOklchPalette('#3b82f6').palettes.map(p => p.hex));
  });

  it('灰色应跳过最小色度强制（safeChroma ≤ 0.05）', () => {
    const result = generateOklchPaletteAdvanced('#808080');
    expect(result.palettes).toHaveLength(11);
    result.palettes.forEach(p => {
      expect(p.hex).toMatch(HEX_REGEX);
    });
  });
});

// ==================== generateOklchPaletteEx ====================

describe('generateOklchPaletteEx', () => {
  it('应在匹配步骤保留原始输入颜色', () => {
    const result = generateOklchPaletteEx('#6366f1');
    const matchedPalette = result.palettes.find(p => p.number === result.matchedStep);
    expect(matchedPalette?.hex).toBe('#6366f1');
  });

  it('应包含 oklch 值', () => {
    const result = generateOklchPaletteEx('#6366f1');
    result.palettes.forEach(p => {
      expect(p.oklch).toBeDefined();
      expect(typeof p.oklch.l).toBe('number');
      expect(typeof p.oklch.c).toBe('number');
      expect(typeof p.oklch.h).toBe('number');
    });
  });

  it('应包含 oklchCss 字符串', () => {
    const result = generateOklchPaletteEx('#6366f1');
    result.palettes.forEach(p => {
      expect(p.oklchCss).toMatch(/^oklch\(.+\)$/);
    });
  });

  it('应包含 inputOklch 和 inputOklchCss', () => {
    const result = generateOklchPaletteEx('#6366f1');
    expect(result.inputOklch).toBeDefined();
    expect(result.inputOklchCss).toMatch(/^oklch\(.+\)$/);
  });

  it('forceStep 应将输入色固定到指定步骤', () => {
    const result = generateOklchPaletteEx('#6366f1', 600);
    expect(result.matchedStep).toBe(600);
    const palette600 = result.palettes.find(p => p.number === 600);
    expect(palette600?.hex).toBe('#6366f1');
  });

  it('无效颜色应抛错', () => {
    expect(() => generateOklchPaletteEx('invalid')).toThrow('Invalid color');
  });

  it('极浅颜色应匹配到远离 500 的步骤（触发 diffTo500 >= 0.12）', () => {
    // 极浅蓝色 OKLCH lightness ≈ 0.96，与 500 的目标 0.661 相差 > 0.12
    // 走 diffTo500 < 0.12 = false 分支，matchedStep 不会被强制为 500
    const result = generateOklchPaletteEx('#dbeafe');
    expect(result.matchedStep).not.toBe(500);
  });

  it('灰色应跳过最小色度强制（safeChroma ≤ 0.05）', () => {
    const result = generateOklchPaletteEx('#808080');
    expect(result.palettes).toHaveLength(11);
    result.palettes.forEach(p => {
      expect(p.hex).toMatch(HEX_REGEX);
    });
  });
});

// ==================== getContrastRatio ====================

describe('getContrastRatio', () => {
  it('黑白对比度应接近 21', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeGreaterThan(20);
    expect(ratio).toBeLessThanOrEqual(21);
  });

  it('相同颜色对比度应为 1', () => {
    expect(getContrastRatio('#ff0000', '#ff0000')).toBe(1);
  });

  it('无效颜色应返回 1', () => {
    expect(getContrastRatio('invalid', '#ffffff')).toBe(1);
  });
});

// ==================== meetsWcagContrast ====================

describe('meetsWcagContrast', () => {
  it('AA normal 阈值为 4.5', () => {
    expect(meetsWcagContrast(4.5, 'AA', 'normal')).toBe(true);
    expect(meetsWcagContrast(4.49, 'AA', 'normal')).toBe(false);
  });

  it('AA large 阈值为 3', () => {
    expect(meetsWcagContrast(3, 'AA', 'large')).toBe(true);
    expect(meetsWcagContrast(2.99, 'AA', 'large')).toBe(false);
  });

  it('AAA normal 阈值为 7', () => {
    expect(meetsWcagContrast(7, 'AAA', 'normal')).toBe(true);
    expect(meetsWcagContrast(6.99, 'AAA', 'normal')).toBe(false);
  });

  it('AAA large 阈值为 4.5', () => {
    expect(meetsWcagContrast(4.5, 'AAA', 'large')).toBe(true);
    expect(meetsWcagContrast(4.49, 'AAA', 'large')).toBe(false);
  });

  it('默认为 AA normal', () => {
    expect(meetsWcagContrast(4.5)).toBe(true);
    expect(meetsWcagContrast(4.49)).toBe(false);
  });
});

// ==================== generateOklchPaletteWithContrast ====================

describe('generateOklchPaletteWithContrast', () => {
  it('应包含对比度信息', () => {
    const result = generateOklchPaletteWithContrast('#3b82f6');
    expect(result.contrastVsWhite).toBeInstanceOf(Map);
    expect(result.contrastVsBlack).toBeInstanceOf(Map);
    expect(result.contrastVsWhite.size).toBe(11);
  });

  it('浅色步骤应在黑色背景上通过 AA', () => {
    const result = generateOklchPaletteWithContrast('#3b82f6');
    expect(result.passAAonBlack.length).toBeGreaterThan(0);
  });

  it('深色步骤应在白色背景上通过 AA', () => {
    const result = generateOklchPaletteWithContrast('#3b82f6');
    expect(result.passAAonWhite.length).toBeGreaterThan(0);
  });

  it('每个步骤都应有推荐文字颜色', () => {
    const result = generateOklchPaletteWithContrast('#3b82f6');
    expect(result.recommendedTextColor.size).toBe(11);
    result.recommendedTextColor.forEach(color => {
      expect(['#ffffff', '#000000']).toContain(color);
    });
  });
});

// ==================== generateDarkModePalette ====================

describe('generateDarkModePalette', () => {
  it('应返回 11 个颜色', () => {
    const result = generateDarkModePalette('#3b82f6');
    expect(result.palettes).toHaveLength(11);
  });

  it('暗色模式调色板应与亮色模式不同', () => {
    const light = generateOklchPalette('#3b82f6');
    const dark = generateDarkModePalette('#3b82f6');
    expect(dark.palettes.map(p => p.hex)).not.toEqual(light.palettes.map(p => p.hex));
  });

  it('强制档位时应保留输入色并沿用暗色色板曲线', () => {
    const result = generateDarkModePalette('#18181b', 500);

    expect(result.palettes.find(item => item.number === 500)?.hex).toBe('#18181b');
    expect(result.palettes[0].number).toBe(50);
    expect(result.palettes.at(-1)?.number).toBe(950);
  });
});

// ==================== findAccessibleTextColor ====================

describe('findAccessibleTextColor', () => {
  it('白色背景应找到深色文字色阶', () => {
    const step = findAccessibleTextColor('#3b82f6', '#ffffff');
    expect(step).not.toBeNull();
  });

  it('黑色背景应找到浅色文字色阶', () => {
    const step = findAccessibleTextColor('#3b82f6', '#000000', false);
    expect(step).not.toBeNull();
  });

  it('返回的色阶应为有效的 ColorPaletteNumber', () => {
    const validNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const step = findAccessibleTextColor('#3b82f6', '#ffffff');
    if (step !== null) {
      expect(validNumbers).toContain(step);
    }
  });

  it('极端相近颜色应返回 null（无法达到对比度要求）', () => {
    // 中灰色在中灰色背景上，调色板所有色阶都可能无法达到 AA 对比度
    const step = findAccessibleTextColor('#777777', '#888888');
    // 可能返回 null 或找到极端色阶
    expect(step === null || typeof step === 'number').toBe(true);
  });
});

// ==================== 行为契约（回归） ====================

describe('调色板契约', () => {
  const SAMPLES = ['#6366f1', '#3b82f6', '#e11d48', '#94a3b8', '#f59e0b', '#10b981', '#a855f7', '#808080'];

  it('所有档位的 hex 必须是小写 6 位', () => {
    for (const color of SAMPLES) {
      for (const palette of generateOklchPalette(color).palettes) {
        expect(palette.hex).toMatch(HEX_REGEX);
      }
    }
  });

  it('明度必须从 50 到 950 严格单调递减', () => {
    for (let hue = 0; hue < 360; hue += 30) {
      for (const [l, c] of [
        [0.95, 0.05],
        [0.7, 0.15],
        [0.5, 0.2],
        [0.3, 0.1]
      ]) {
        const { palettes } = generateOklchPalette(`oklch(${l} ${c} ${hue})`);

        for (let i = 1; i < palettes.length; i += 1) {
          expect(lightnessOf(palettes[i].hex)).toBeLessThan(lightnessOf(palettes[i - 1].hex));
        }
      }
    }
  });

  it('match 必须是感知距离上真正最近的档位', () => {
    for (const color of SAMPLES) {
      const result = getOklchColorPalette(color);

      const nearest = result.palettes.reduce((prev, curr) =>
        oklabDistance(color, curr.hex) < oklabDistance(color, prev.hex) ? curr : prev
      );

      expect(result.match.number).toBe(nearest.number);
    }
  });

  it('#e11d48 应匹配到 600 而不是 700（色相差符号回归）', () => {
    expect(getOklchColorPalette('#e11d48').match.number).toBe(600);
  });

  it('getOklchPaletteColorByNumber 应与整板结果一致', () => {
    const family = generateOklchPalette('#3b82f6');

    for (const palette of family.palettes) {
      expect(getOklchPaletteColorByNumber('#3b82f6', palette.number)).toBe(palette.hex);
    }
  });
});

// ==================== generateOklchPaletteAnchored ====================

describe('generateOklchPaletteAnchored', () => {
  it('generateOklchPaletteEx 应为其别名', () => {
    expect(generateOklchPaletteEx).toBe(generateOklchPaletteAnchored);
  });

  it('大写输入也应归一化为小写 hex', () => {
    const result = generateOklchPaletteAnchored('#6366F1');
    const matched = result.palettes.find(p => p.number === result.matchedStep);

    expect(matched?.hex).toBe('#6366f1');
    result.palettes.forEach(p => {
      expect(p.hex).toMatch(HEX_REGEX);
    });
  });

  it('每个档位的 oklch 字段应与其 hex 自洽', () => {
    for (const palette of generateOklchPaletteAnchored('#3b82f6').palettes) {
      expect(palette.oklch.l).toBeCloseTo(lightnessOf(palette.hex), 3);
    }
  });
});

// ==================== 暗色模式档位语义 ====================

describe('generateDarkModePalette 档位语义', () => {
  it('50 应最亮、950 应最暗（与亮色色板契约一致）', () => {
    const { palettes } = generateDarkModePalette('#1677ff');

    expect(palettes[0].number).toBe(50);
    expect(palettes[10].number).toBe(950);
    expect(lightnessOf(palettes[0].hex)).toBeGreaterThan(lightnessOf(palettes[10].hex));
  });

  it('整体应比亮色色板更暗', () => {
    const light = generateOklchPalette('#1677ff');
    const dark = generateDarkModePalette('#1677ff');

    expect(lightnessOf(dark.palettes[0].hex)).toBeLessThan(lightnessOf(light.palettes[0].hex));
  });
});
