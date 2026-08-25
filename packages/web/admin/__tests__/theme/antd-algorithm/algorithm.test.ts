import type { SeedToken } from 'antd/lib/theme/interface';
import { describe, expect, it } from 'vitest';
import derivativeDark from '@shell/theme/antd-algorithm/algorithm/dark';
import derivative from '@shell/theme/antd-algorithm/algorithm/default';
import { seedToken } from '@shell/theme/antd-algorithm/seed';

const token = seedToken as unknown as SeedToken;

describe('derivative（light 模式）', () => {
  it('应继承 seed token 中的非颜色字段', () => {
    const result = derivative(token);

    // 非颜色字段应直接透传
    expect(result.fontSize).toBe(token.fontSize);
    expect(result.borderRadius).toBe(token.borderRadius);
  });

  it('应生成 colorPrimary 语义色系列', () => {
    const result = derivative(token);

    expect(result).toHaveProperty('colorPrimary');
    expect(result).toHaveProperty('colorPrimaryHover');
    expect(result).toHaveProperty('colorPrimaryActive');
    expect(result).toHaveProperty('colorPrimaryBg');
    expect(result).toHaveProperty('colorPrimaryBgHover');
    expect(result).toHaveProperty('colorPrimaryBorder');
    expect(result).toHaveProperty('colorPrimaryBorderHover');
    expect(result).toHaveProperty('colorPrimaryText');
    expect(result).toHaveProperty('colorPrimaryTextHover');
    expect(result).toHaveProperty('colorPrimaryTextActive');
  });

  it('应生成 colorError 语义色及特有的 BgActive / BgFilledHover', () => {
    const result = derivative(token);

    expect(result).toHaveProperty('colorError');
    expect(result).toHaveProperty('colorErrorBgActive');
    expect(result).toHaveProperty('colorErrorBgFilledHover');
  });

  it('应生成预设颜色的 palette vars（blue-1, blue-500 等）', () => {
    const result = derivative(token);

    expect(result).toHaveProperty('blue1');
    expect(result).toHaveProperty('blue3');
    expect(result).toHaveProperty('blue6');
    expect(result).toHaveProperty('blue7');
    expect(result).toHaveProperty('geekblue1');
    expect(result).toHaveProperty('geekblue7');
    expect(result).toHaveProperty('blue-1');
    expect(result).toHaveProperty('blue-500');
    expect(result).toHaveProperty('blue-950');
  });

  it('应生成 font tokens', () => {
    const result = derivative(token);

    expect(result).toHaveProperty('fontSize');
    expect(result).toHaveProperty('fontSizeLG');
    expect(result).toHaveProperty('fontSizeHeading1');
  });

  it('应生成 size tokens', () => {
    const result = derivative(token);

    expect(result).toHaveProperty('sizeXXS');
    expect(result).toHaveProperty('sizeXL');
    expect(result).toHaveProperty('sizeXXL');
  });

  it('应生成 radius tokens', () => {
    const result = derivative(token);

    expect(result).toHaveProperty('borderRadius');
    expect(result).toHaveProperty('borderRadiusSM');
    expect(result).toHaveProperty('borderRadiusLG');
  });

  it('colorPrimary 应为合法 hex 颜色', () => {
    const result = derivative(token);

    expect(result.colorPrimary).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('info / success / warning / error 颜色系列均应存在', () => {
    const result = derivative(token);

    for (const color of ['colorInfo', 'colorSuccess', 'colorWarning', 'colorError']) {
      expect(result).toHaveProperty(color);
    }
  });
});

describe('derivativeDark（dark 模式）', () => {
  it('应返回包含 seed token 字段的 mapToken', () => {
    const result = derivativeDark(token);

    expect(result.colorPrimary).toBeDefined();
  });

  it('应覆盖 colorPrimaryBg 和 colorPrimaryBgHover（dark 特有）', () => {
    const lightResult = derivative(token);
    const darkResult = derivativeDark(token);

    // dark 模式的 colorPrimaryBg 来自 colorPrimaryBorder，与 light 不同
    expect(darkResult.colorPrimaryBg).not.toBe(lightResult.colorPrimaryBg);
  });

  it('应生成 colorError 特有字段', () => {
    const result = derivativeDark(token);

    expect(result).toHaveProperty('colorErrorBgActive');
    expect(result).toHaveProperty('colorErrorBgFilledHover');
  });

  it('支持传入已有 mapToken 参数', () => {
    const lightMap = derivative(token);
    const result = derivativeDark(token, lightMap);

    expect(result.colorPrimary).toBeDefined();
  });

  it('dark 模式应生成 palette vars', () => {
    const result = derivativeDark(token);

    expect(result).toHaveProperty('primary-1');
    expect(result).toHaveProperty('primary-500');
  });
});
