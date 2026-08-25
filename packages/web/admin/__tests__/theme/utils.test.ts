import { afterEach, describe, expect, it } from 'vitest';

import { defaultThemeSettings } from '@shell/theme/config/default';
import { isDarkModeClass, toggleCssDarkMode } from '@shell/theme/utils/dark-mode';
import { clearAuxiliaryColorModes, toggleAuxiliaryColorModes } from '@shell/theme/utils/filters';
import { getDefaultThemeSettings, getThemeColors, mergeThemeSettings } from '@shell/theme/utils/settings';

describe('utils/settings', () => {
  describe('getDefaultThemeSettings', () => {
    it('返回 defaultThemeSettings 引用', () => {
      const result = getDefaultThemeSettings();
      expect(result).toBe(defaultThemeSettings);
      expect(result.themeScheme).toBe('light');
      expect(result.themeColor).toBe('#6366F1');
    });
  });

  describe('mergeThemeSettings', () => {
    it('settings 为空时返回 defaults', () => {
      const result = mergeThemeSettings();
      expect(result).toBe(defaultThemeSettings);
    });

    it('合并浅层字段，自定义值覆盖默认值', () => {
      const result = mergeThemeSettings({ themeColor: '#FF0000', themeScheme: 'dark' });
      expect(result.themeColor).toBe('#FF0000');
      expect(result.themeScheme).toBe('dark');
      expect(result.themeRadius).toBe(defaultThemeSettings.themeRadius);
    });

    it('深度合并嵌套对象 (otherColor)', () => {
      const result = mergeThemeSettings({
        otherColor: { error: '#000000' } as Theme.OtherColor
      });
      expect(result.otherColor.error).toBe('#000000');
      expect(result.otherColor.info).toBe(defaultThemeSettings.otherColor.info);
      expect(result.otherColor.success).toBe(defaultThemeSettings.otherColor.success);
    });

    it('深度合并 watermark 子字段', () => {
      const result = mergeThemeSettings({
        watermark: { text: 'Hello', visible: true } as Theme.ThemeSetting['watermark']
      });
      expect(result.watermark.visible).toBe(true);
      expect(result.watermark.text).toBe('Hello');
      expect(result.watermark.timeFormat).toBe(defaultThemeSettings.watermark.timeFormat);
    });

    it('支持自定义 defaults 参数', () => {
      const customDefaults = {
        ...defaultThemeSettings,
        themeColor: '#AAAAAA'
      } as Theme.ThemeSetting;

      const result = mergeThemeSettings({ themeScheme: 'dark' }, customDefaults);
      expect(result.themeColor).toBe('#AAAAAA');
      expect(result.themeScheme).toBe('dark');
    });
  });

  describe('getThemeColors', () => {
    it('isInfoFollowPrimary=false 时 info 取自 otherColor', () => {
      const colors = getThemeColors({
        ...defaultThemeSettings,
        isInfoFollowPrimary: false,
        themeColor: '#111111',
        otherColor: {
          ...defaultThemeSettings.otherColor,
          info: '#0EA5E9'
        }
      });

      expect(colors.primary).toBe('#111111');
      expect(colors.info).toBe('#0EA5E9');
    });

    it('isInfoFollowPrimary=true 时 info 跟随 primary', () => {
      const colors = getThemeColors({
        ...defaultThemeSettings,
        isInfoFollowPrimary: true,
        themeColor: '#222222',
        otherColor: {
          ...defaultThemeSettings.otherColor,
          info: '#0EA5E9'
        }
      });

      expect(colors.primary).toBe('#222222');
      expect(colors.info).toBe('#222222');
    });

    it('其它颜色字段从 otherColor 继承', () => {
      const colors = getThemeColors(defaultThemeSettings);
      expect(colors.success).toBe(defaultThemeSettings.otherColor.success);
      expect(colors.warning).toBe(defaultThemeSettings.otherColor.warning);
      expect(colors.error).toBe(defaultThemeSettings.otherColor.error);
    });
  });
});

describe('utils/dark-mode', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('toggleCssDarkMode(true) 在 html 上添加 dark 类', () => {
    toggleCssDarkMode(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggleCssDarkMode(false) 移除 dark 类', () => {
    document.documentElement.classList.add('dark');
    toggleCssDarkMode(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggleCssDarkMode() 默认参数等同于 false', () => {
    document.documentElement.classList.add('dark');
    toggleCssDarkMode();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('isDarkModeClass 反映当前 html 的 dark 状态', () => {
    expect(isDarkModeClass()).toBe(false);
    toggleCssDarkMode(true);
    expect(isDarkModeClass()).toBe(true);
    toggleCssDarkMode(false);
    expect(isDarkModeClass()).toBe(false);
  });
});

describe('utils/filters', () => {
  afterEach(() => {
    document.documentElement.style.filter = '';
  });

  it('两者都 false 时 filter 为空字符串', () => {
    toggleAuxiliaryColorModes(false, false);
    expect(document.documentElement.style.filter).toBe('');
  });

  it('仅 grayscale 启用时输出 grayscale(100%)', () => {
    toggleAuxiliaryColorModes(true, false);
    expect(document.documentElement.style.filter).toBe('grayscale(100%)');
  });

  it('仅 colourWeakness 启用时输出 invert(80%)', () => {
    toggleAuxiliaryColorModes(false, true);
    expect(document.documentElement.style.filter).toBe('invert(80%)');
  });

  it('两者均启用时同时输出，并以空格分隔', () => {
    toggleAuxiliaryColorModes(true, true);
    expect(document.documentElement.style.filter).toBe('grayscale(100%) invert(80%)');
  });

  it('默认参数等同于全部 false', () => {
    document.documentElement.style.filter = 'grayscale(100%)';
    toggleAuxiliaryColorModes();
    expect(document.documentElement.style.filter).toBe('');
  });

  it('clearAuxiliaryColorModes 清空 filter', () => {
    document.documentElement.style.filter = 'grayscale(100%) invert(80%)';
    clearAuxiliaryColorModes();
    expect(document.documentElement.style.filter).toBe('');
  });
});
