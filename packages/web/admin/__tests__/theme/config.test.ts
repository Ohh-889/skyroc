import { describe, expect, it } from 'vitest';

import { icons } from '@shell/theme/components/shared';
import { defaultThemeSettings, themeSchemeIcons } from '@shell/theme/config';

describe('themeSchemeIcons', () => {
  it('包含 light/dark/auto 三种 icon', () => {
    expect(themeSchemeIcons.light).toBe('material-symbols:sunny');
    expect(themeSchemeIcons.dark).toBe('material-symbols:nightlight-rounded');
    expect(themeSchemeIcons.auto).toBe('material-symbols:hdr-auto');
  });
});

describe('components/shared icons', () => {
  it('与 themeSchemeIcons 配置保持一致', () => {
    expect(icons).toEqual(themeSchemeIcons);
  });
});

describe('defaultThemeSettings 关键字段', () => {
  it('themeScheme 默认 light', () => {
    expect(defaultThemeSettings.themeScheme).toBe('light');
  });

  it('themeColor 与 themeRadius 有合理默认值', () => {
    expect(defaultThemeSettings.themeColor).toMatch(/^#[0-9a-f]{6}$/i);
    expect(defaultThemeSettings.themeRadius).toBeGreaterThan(0);
  });

  it('layout/page/header/tab/sider/footer/watermark/tokens 节点齐全', () => {
    expect(defaultThemeSettings.layout).toBeDefined();
    expect(defaultThemeSettings.page).toBeDefined();
    expect(defaultThemeSettings.header).toBeDefined();
    expect(defaultThemeSettings.tab).toBeDefined();
    expect(defaultThemeSettings.sider).toBeDefined();
    expect(defaultThemeSettings.footer).toBeDefined();
    expect(defaultThemeSettings.watermark).toBeDefined();
    expect(defaultThemeSettings.tokens.light).toBeDefined();
    expect(defaultThemeSettings.tokens.dark).toBeDefined();
  });

  it('otherColor 包含 info/success/warning/error 4 个字段', () => {
    // oxlint-disable-next-line unicorn/no-array-sort
    expect(Object.keys(defaultThemeSettings.otherColor).sort()).toEqual(['error', 'info', 'success', 'warning']);
  });
});
