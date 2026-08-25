import { describe, expect, it } from 'vitest';
import {
  FONT_SIZES,
  LINE_HEIGHTS,
  genFontMapToken,
  genFontSizes,
  getLineHeightRatio,
  remToPx
} from '@shell/theme/antd-algorithm/shared/genFontMapToken';

describe('remToPx', () => {
  it('默认 baseFontSize=16 时应正确转换', () => {
    expect(remToPx(1)).toBe(16);
    expect(remToPx(0.75)).toBe(12);
    expect(remToPx(0.875)).toBe(14);
    expect(remToPx(1.5)).toBe(24);
  });

  it('自定义 baseFontSize 时应按比例换算', () => {
    expect(remToPx(1, 20)).toBe(20);
    expect(remToPx(0.5, 20)).toBe(10);
  });

  it('结果应为整数（Math.round）', () => {
    const result = remToPx(0.875, 16);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('getLineHeightRatio', () => {
  it('行高比等于 lineHeight / fontSize，保留 3 位小数', () => {
    expect(getLineHeightRatio(1, 1.5)).toBe(1.5);
    expect(getLineHeightRatio(0.875, 1.375)).toBeCloseTo(1.571, 2);
  });
});

describe('genFontSizes', () => {
  it('应生成 13 个字体大小对', () => {
    const result = genFontSizes();
    expect(result).toHaveLength(13);
  });

  it('baseFontSize=16 时各尺寸应与 FONT_SIZES 对应', () => {
    const result = genFontSizes(16);
    const keys = Object.keys(FONT_SIZES) as (keyof typeof FONT_SIZES)[];

    keys.forEach((key, index) => {
      expect(result[index].size).toBe(remToPx(FONT_SIZES[key], 16));
    });
  });

  it('字体大小应从小到大单调递增', () => {
    const result = genFontSizes();
    for (let i = 1; i < result.length; i += 1) {
      expect(result[i].size).toBeGreaterThan(result[i - 1].size);
    }
  });
});

describe('genFontMapToken', () => {
  it('默认参数下应生成正确的 antd 基础字体 tokens', () => {
    const result = genFontMapToken(16);

    expect(result.fontSizeSM).toBe(14); // sm: 0.875rem * 16 = 14px
    expect(result.fontSize).toBe(16); // base: 1rem * 16 = 16px
    expect(result.fontSizeLG).toBe(18); // lg: 1.125rem * 16 = 18px
    expect(result.fontSizeXL).toBe(20); // xl: 1.25rem * 16 = 20px
  });

  it('应生成正确的标题字体大小', () => {
    const result = genFontMapToken(16);

    expect(result.fontSizeHeading5).toBe(20); // xl
    expect(result.fontSizeHeading4).toBe(24); // 2xl
    expect(result.fontSizeHeading3).toBe(30); // 3xl
    expect(result.fontSizeHeading2).toBe(36); // 4xl
    expect(result.fontSizeHeading1).toBe(48); // 5xl
  });

  it('应生成完整的 Text* 尺寸系列', () => {
    const result = genFontMapToken(16);

    expect(result.TextXs).toBe(12);
    expect(result.TextSm).toBe(14);
    expect(result.TextBase).toBe(16);
    expect(result.TextLg).toBe(18);
    expect(result.TextXl).toBe(20);
    expect(result.Text2xl).toBe(24);
    expect(result.Text3xl).toBe(30);
    expect(result.Text4xl).toBe(36);
    expect(result.Text5xl).toBe(48);
  });

  it('应生成完整的 LineHeight* 系列（px）', () => {
    const result = genFontMapToken(16);

    expect(result.LineHeightXs).toBe(remToPx(LINE_HEIGHTS.xs, 16)); // 18
    expect(result.LineHeightSm).toBe(remToPx(LINE_HEIGHTS.sm, 16)); // 22
    expect(result.LineHeightBase).toBe(remToPx(LINE_HEIGHTS.base, 16)); // 24
  });

  it('fontHeight 应等于 lineHeight ratio × fontSize 的 round', () => {
    const result = genFontMapToken(16);

    expect(result.fontHeight).toBe(Math.round(result.lineHeight * result.fontSize));
  });

  it('标题大小应从 H1 到 H5 单调递减', () => {
    const result = genFontMapToken(16);

    expect(result.fontSizeHeading1).toBeGreaterThan(result.fontSizeHeading2);
    expect(result.fontSizeHeading2).toBeGreaterThan(result.fontSizeHeading3);
    expect(result.fontSizeHeading3).toBeGreaterThan(result.fontSizeHeading4);
    expect(result.fontSizeHeading4).toBeGreaterThan(result.fontSizeHeading5);
  });
});
