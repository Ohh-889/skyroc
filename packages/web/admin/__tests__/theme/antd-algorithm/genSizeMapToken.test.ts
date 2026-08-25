import { describe, expect, it } from 'vitest';
import {
  SPACING_MULTIPLIERS,
  calcSpacing,
  genSizeMapToken,
  genSpacingSizes,
  genSpacingVars
} from '@shell/theme/antd-algorithm/shared/genSizeMapToken';

describe('calcSpacing', () => {
  it('默认 sizeUnit=4 时应正确计算', () => {
    expect(calcSpacing(1)).toBe(4);
    expect(calcSpacing(2)).toBe(8);
    expect(calcSpacing(4)).toBe(16);
    expect(calcSpacing(8)).toBe(32);
  });

  it('自定义 sizeUnit 时应按比例缩放', () => {
    expect(calcSpacing(4, 8)).toBe(32);
    expect(calcSpacing(4, 2)).toBe(8);
  });
});

describe('genSizeMapToken', () => {
  it('默认 sizeUnit=4 时应生成 antd 标准 size tokens', () => {
    const result = genSizeMapToken();

    expect(result.sizeXXS).toBe(4); // 4 * 1
    expect(result.sizeXS).toBe(8); // 4 * 2
    expect(result.sizeSM).toBe(12); // 4 * 3
    expect(result.sizeMS).toBe(16); // 4 * 4
    expect(result.size).toBe(16); // 4 * 4
    expect(result.sizeMD).toBe(20); // 4 * 5
    expect(result.sizeLG).toBe(24); // 4 * 6
    expect(result.sizeXL).toBe(32); // 4 * 8
    expect(result.sizeXXL).toBe(48); // 4 * 12
  });

  it('sizeUnit=8 时所有 size 应翻倍', () => {
    const base = genSizeMapToken(4);
    const doubled = genSizeMapToken(8);

    expect(doubled.sizeXXS).toBe(base.sizeXXS * 2);
    expect(doubled.sizeXL).toBe(base.sizeXL * 2);
    expect(doubled.sizeXXL).toBe(base.sizeXXL * 2);
  });

  it('size 与 sizeMS 应始终相等', () => {
    const result = genSizeMapToken(4);
    expect(result.size).toBe(result.sizeMS);
  });

  it('XXS < XS < SM < size < MD < LG < XL < XXL', () => {
    const r = genSizeMapToken();

    expect(r.sizeXXS).toBeLessThan(r.sizeXS);
    expect(r.sizeXS).toBeLessThan(r.sizeSM);
    expect(r.sizeSM).toBeLessThan(r.size);
    expect(r.size).toBeLessThan(r.sizeMD);
    expect(r.sizeMD).toBeLessThan(r.sizeLG);
    expect(r.sizeLG).toBeLessThan(r.sizeXL);
    expect(r.sizeXL).toBeLessThan(r.sizeXXL);
  });
});

describe('genSpacingSizes', () => {
  it('应包含所有 SPACING_MULTIPLIERS 键', () => {
    const result = genSpacingSizes(4);
    const keys = Object.keys(SPACING_MULTIPLIERS);

    for (const key of keys) {
      expect(result).toHaveProperty(key);
    }
  });

  it('值应等于 sizeUnit × 对应乘数', () => {
    const result = genSpacingSizes(4);

    expect(result['3xs']).toBe(4 * SPACING_MULTIPLIERS['3xs']);
    expect(result['9xl']).toBe(4 * SPACING_MULTIPLIERS['9xl']);
  });
});

describe('genSpacingVars', () => {
  it('应生成 spacing-{key} 格式的 CSS 变量', () => {
    const vars = genSpacingVars(4);

    expect(vars['spacing-3xs']).toBe('4px');
    expect(vars['spacing-md']).toBe('16px');
    expect(vars['spacing-xl']).toBe('24px');
  });

  it('所有 CSS 变量值均以 px 结尾', () => {
    const vars = genSpacingVars(4);

    for (const value of Object.values(vars)) {
      expect(value).toMatch(/px$/);
    }
  });
});
