import { describe, expect, it } from 'vitest';

import { getAntdTheme } from '../../src/antd/shared';
import { defaultThemeSettings } from '../../src/config/default';
import { getThemeColors } from '../../src/utils/settings';

describe('getAntdTheme', () => {
  it('light 模式：containerBg 取自 tokens.light.colors.container，algorithm 为非 dark', () => {
    const colors = getThemeColors(defaultThemeSettings);
    const theme = getAntdTheme(colors, false, defaultThemeSettings);

    expect(theme.algorithm).toHaveLength(1);
    expect(theme.token?.colorPrimary).toBe(colors.primary);
    expect(theme.token?.colorError).toBe(colors.error);
    expect(theme.token?.colorInfo).toBe(colors.info);
    expect(theme.token?.colorSuccess).toBe(colors.success);
    expect(theme.token?.colorWarning).toBe(colors.warning);
    expect(theme.token?.borderRadius).toBe(defaultThemeSettings.themeRadius);
    expect(theme.token?.fontSize).toBe(defaultThemeSettings.themeTextSize);
    expect(theme.token?.colorBgContainer).toBe(defaultThemeSettings.tokens.light?.colors.container);
    expect(theme.token?.colorBorder).toBe('#C6C6C8');
  });

  it('dark 模式：containerBg=#1C1C1E，borderColor=#2E3138', () => {
    const colors = getThemeColors(defaultThemeSettings);
    const theme = getAntdTheme(colors, true, defaultThemeSettings);

    expect(theme.token?.colorBgContainer).toBe('#1C1C1E');
    expect(theme.token?.colorBorder).toBe('#2E3138');
  });

  it('cssVar / hashed 配置为约定值', () => {
    const colors = getThemeColors(defaultThemeSettings);
    const theme = getAntdTheme(colors, false, defaultThemeSettings);

    expect(theme.cssVar).toEqual({ key: 'root', prefix: '' });
    expect(theme.hashed).toBe(false);
  });

  it('components 中 Button/Collapse/Menu/Modal 节点存在', () => {
    const colors = getThemeColors(defaultThemeSettings);
    const theme = getAntdTheme(colors, false, defaultThemeSettings);

    expect(theme.components?.Button?.controlHeightSM).toBe(28);
    expect(theme.components?.Collapse?.contentPadding).toBeDefined();
    expect(theme.components?.Menu?.itemSelectedBg).toBeDefined();
    expect(theme.components?.Modal?.borderRadiusLG).toBe(13);
  });
});
