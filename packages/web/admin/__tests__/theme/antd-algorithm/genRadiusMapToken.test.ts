import {
  RADIUS_MULTIPLIERS,
  calcRadius,
  genExtendedRadiusToken,
  genRadiusMapToken,
  genRadiusSizes,
  genRadiusVars
} from '@shell/theme/antd-algorithm/shared/genRadiusMapToken';
import { describe, expect, it } from 'vitest';

describe('calcRadius', () => {
  it('乘数为 -1（full）时应返回 9999', () => {
    expect(calcRadius(-1)).toBe(9999);
    expect(calcRadius(-1, 10)).toBe(9999);
  });

  it('默认 borderRadius=6 时应正确计算', () => {
    expect(calcRadius(RADIUS_MULTIPLIERS.none, 6)).toBe(0); // 0
    expect(calcRadius(RADIUS_MULTIPLIERS.xs, 6)).toBe(2); // 6/3 = 2
    expect(calcRadius(RADIUS_MULTIPLIERS.sm, 6)).toBe(4); // 6*2/3 = 4
    expect(calcRadius(RADIUS_MULTIPLIERS.md, 6)).toBe(6); // 6
    expect(calcRadius(RADIUS_MULTIPLIERS.lg, 6)).toBe(8); // 6*4/3 ≈ 8
    expect(calcRadius(RADIUS_MULTIPLIERS.xl, 6)).toBe(12); // 6*2 = 12
    expect(calcRadius(RADIUS_MULTIPLIERS['2xl'], 6)).toBe(16); // 6*8/3 ≈ 16
    expect(calcRadius(RADIUS_MULTIPLIERS['3xl'], 6)).toBe(24); // 6*4 = 24
    expect(calcRadius(RADIUS_MULTIPLIERS['4xl'], 6)).toBe(32); // 6*16/3 ≈ 32
  });

  it('自定义 borderRadius=12 时结果应翻倍', () => {
    expect(calcRadius(RADIUS_MULTIPLIERS.md, 12)).toBe(12);
    expect(calcRadius(RADIUS_MULTIPLIERS.xl, 12)).toBe(24);
  });
});

describe('genRadiusMapToken', () => {
  it('默认参数（borderRadius=6）应生成 antd 标准 5 级圆角', () => {
    const result = genRadiusMapToken();

    expect(result.borderRadiusXS).toBe(2); // xs
    expect(result.borderRadiusSM).toBe(4); // sm
    expect(result.borderRadius).toBe(6); // md
    expect(result.borderRadiusLG).toBe(8); // lg
    expect(result.borderRadiusOuter).toBe(4); // sm
  });

  it('传入 borderRadius=0 时所有圆角应为 0', () => {
    const result = genRadiusMapToken(0);

    expect(result.borderRadiusXS).toBe(0);
    expect(result.borderRadiusSM).toBe(0);
    expect(result.borderRadius).toBe(0);
    expect(result.borderRadiusLG).toBe(0);
    expect(result.borderRadiusOuter).toBe(0);
  });

  it('传入 borderRadius=12 时所有圆角应翻倍', () => {
    const result = genRadiusMapToken(12);

    expect(result.borderRadiusXS).toBe(4);
    expect(result.borderRadiusSM).toBe(8);
    expect(result.borderRadius).toBe(12);
    expect(result.borderRadiusLG).toBe(16);
    expect(result.borderRadiusOuter).toBe(8);
  });

  it('XS < SM < borderRadius < LG', () => {
    const result = genRadiusMapToken(6);

    expect(result.borderRadiusXS).toBeLessThan(result.borderRadiusSM);
    expect(result.borderRadiusSM).toBeLessThan(result.borderRadius);
    expect(result.borderRadius).toBeLessThan(result.borderRadiusLG);
  });
});

describe('genExtendedRadiusToken', () => {
  it('应包含基础 5 级圆角 + 扩展 5 级圆角', () => {
    const result = genExtendedRadiusToken(6);

    // 基础
    expect(result.borderRadius).toBe(6);
    // 扩展
    expect(result.borderRadiusXL).toBe(12);
    expect(result.borderRadius2XL).toBe(16);
    expect(result.borderRadius3XL).toBe(24);
    expect(result.borderRadius4XL).toBe(32);
    expect(result.borderRadiusFull).toBe(9999);
  });
});

describe('genRadiusSizes', () => {
  it('应包含所有 RADIUS_MULTIPLIERS 键', () => {
    const result = genRadiusSizes(6);
    const keys = Object.keys(RADIUS_MULTIPLIERS);

    for (const key of keys) {
      expect(result).toHaveProperty(key);
    }
  });

  it('full 键应固定为 9999', () => {
    expect(genRadiusSizes(6).full).toBe(9999);
    expect(genRadiusSizes(100).full).toBe(9999);
  });
});

describe('genRadiusVars', () => {
  it('应为每个 key 生成 radius-{key} CSS 变量', () => {
    const vars = genRadiusVars(6);

    expect(vars['radius-none']).toBe('0px');
    expect(vars['radius-xs']).toBe('2px');
    expect(vars['radius-sm']).toBe('4px');
    expect(vars['radius-md']).toBe('6px');
    expect(vars['radius-full']).toBe('9999px');
  });

  it('所有 CSS 变量值均以 px 结尾', () => {
    const vars = genRadiusVars(6);

    for (const value of Object.values(vars)) {
      expect(value).toMatch(/px$/);
    }
  });
});
