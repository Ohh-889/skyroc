import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const themeState = vi.hoisted(() => ({
  colourWeaknessMode: false,
  darkMode: false,
  grayscaleMode: false,
  settings: {
    themeColor: '#111111',
    themeScheme: 'light'
  } as Partial<Theme.ThemeSetting>,
  themeColors: {
    error: '#ff0000',
    info: '#1677ff',
    primary: '#111111',
    success: '#00aa00',
    warning: '#ffaa00'
  },
  updateWatermarkTimer: vi.fn(),
  watermark: {
    enableTime: false,
    visible: false
  }
}));

const storageState = vi.hoisted(() => ({
  storage: {
    set: vi.fn()
  }
}));

const utilityMocks = vi.hoisted(() => ({
  toggleAuxiliaryColorModes: vi.fn(),
  toggleCssDarkMode: vi.fn()
}));

vi.mock('@shell/theme/hooks/use-theme', () => ({
  useTheme: () => themeState
}));

vi.mock('@shell/theme/setup', () => ({
  getInternalStorage: () => storageState.storage
}));

vi.mock('@shell/theme/utils', () => utilityMocks);

const { default: ThemeEffect } = await import('@shell/theme/components/ThemeEffect');

function resetThemeState() {
  themeState.colourWeaknessMode = false;
  themeState.darkMode = false;
  themeState.grayscaleMode = false;
  themeState.settings = {
    themeColor: '#111111',
    themeScheme: 'light'
  } as Partial<Theme.ThemeSetting>;
  themeState.themeColors = {
    error: '#ff0000',
    info: '#1677ff',
    primary: '#111111',
    success: '#00aa00',
    warning: '#ffaa00'
  };
  themeState.watermark = {
    enableTime: false,
    visible: false
  };
}

beforeEach(() => {
  resetThemeState();
  storageState.storage.set.mockClear();
  themeState.updateWatermarkTimer.mockClear();
  utilityMocks.toggleAuxiliaryColorModes.mockClear();
  utilityMocks.toggleCssDarkMode.mockClear();
  vi.stubEnv('DEV', true);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ThemeEffect', () => {
  it('挂载时同步暗色、辅助色彩、主题色与水印 timer 副作用', () => {
    themeState.darkMode = true;
    themeState.grayscaleMode = true;
    themeState.colourWeaknessMode = true;
    themeState.themeColors = {
      ...themeState.themeColors,
      primary: '#222222'
    };
    themeState.watermark = {
      enableTime: true,
      visible: true
    };

    render(<ThemeEffect />);

    expect(utilityMocks.toggleCssDarkMode).toHaveBeenCalledWith(true);
    expect(storageState.storage.set).toHaveBeenCalledWith('darkMode', true);
    expect(utilityMocks.toggleAuxiliaryColorModes).toHaveBeenCalledWith(true, true);
    expect(storageState.storage.set).toHaveBeenCalledWith('themeColor', '#222222');
    expect(themeState.updateWatermarkTimer).toHaveBeenCalledOnce();
  });

  it('依赖变化后重新同步对应副作用', () => {
    const { rerender } = render(<ThemeEffect />);

    themeState.darkMode = true;
    themeState.grayscaleMode = true;
    themeState.themeColors = {
      ...themeState.themeColors,
      primary: '#333333'
    };
    themeState.watermark = {
      enableTime: true,
      visible: true
    };

    rerender(<ThemeEffect />);

    expect(utilityMocks.toggleCssDarkMode).toHaveBeenLastCalledWith(true);
    expect(utilityMocks.toggleAuxiliaryColorModes).toHaveBeenLastCalledWith(true, false);
    expect(storageState.storage.set).toHaveBeenCalledWith('themeColor', '#333333');
    expect(themeState.updateWatermarkTimer).toHaveBeenCalledTimes(2);
  });

  it('生产环境 beforeunload 时缓存主题设置', () => {
    vi.stubEnv('DEV', false);

    render(<ThemeEffect />);
    window.dispatchEvent(new Event('beforeunload'));

    expect(storageState.storage.set).toHaveBeenCalledWith('themeSettings', themeState.settings);
  });

  it('非生产环境 beforeunload 时不缓存主题设置', () => {
    render(<ThemeEffect />);
    window.dispatchEvent(new Event('beforeunload'));

    expect(storageState.storage.set).not.toHaveBeenCalledWith('themeSettings', expect.anything());
  });

  it('卸载时移除 beforeunload 监听', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<ThemeEffect />);
    unmount();

    expect(addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });
});
