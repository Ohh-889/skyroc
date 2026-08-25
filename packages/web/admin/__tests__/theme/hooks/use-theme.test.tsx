import { act, renderHook } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// 受控的系统主题 / now mock —— 在导入 use-theme 之前装好
const systemThemeState = { isDarkMode: false };
const nowState = {
  now: new Date('2025-01-02T03:04:05Z'),
  pause: vi.fn(),
  resume: vi.fn()
};

vi.mock('@skyroc/hooks/web', () => ({
  useSystemTheme: () => ({ isDarkMode: systemThemeState.isDarkMode }),
  useNow: () => nowState
}));

const { themeUserNameAtom, useTheme } = await import('@shell/theme/hooks/use-theme');
const { defaultThemeSettings } = await import('@shell/theme/config/default');

function createWrapper(userName?: string) {
  const store = createStore();
  if (userName !== undefined) store.set(themeUserNameAtom, userName);

  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { Wrapper, store };
}

beforeEach(() => {
  systemThemeState.isDarkMode = false;
  nowState.pause.mockClear();
  nowState.resume.mockClear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useTheme - 初始状态', () => {
  it('返回默认 settings 与派生值', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    expect(result.current.themeScheme).toBe(defaultThemeSettings.themeScheme);
    expect(result.current.darkMode).toBe(false);
    expect(result.current.themeColors.primary).toBe(defaultThemeSettings.themeColor);
    expect(result.current.grayscaleMode).toBe(false);
    expect(result.current.colourWeaknessMode).toBe(false);
  });

  it('settingsJson 是 settings 的 JSON 序列化', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    expect(result.current.settingsJson).toBe(JSON.stringify(result.current.settings));
  });
});

describe('useTheme - darkMode 派生', () => {
  it('themeScheme=dark → darkMode=true', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setThemeScheme('dark'));
    expect(result.current.darkMode).toBe(true);
  });

  it('themeScheme=auto 跟随系统：systemIsDark=true → darkMode=true', () => {
    systemThemeState.isDarkMode = true;
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setThemeScheme('auto'));
    expect(result.current.darkMode).toBe(true);
  });

  it('themeScheme=auto 且 systemIsDark=false → darkMode=false', () => {
    systemThemeState.isDarkMode = false;
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setThemeScheme('auto'));
    expect(result.current.darkMode).toBe(false);
  });
});

describe('useTheme - toggleThemeScheme 循环切换', () => {
  it('light → dark → auto → light', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    expect(result.current.themeScheme).toBe('light');

    act(() => result.current.toggleThemeScheme());
    expect(result.current.themeScheme).toBe('dark');

    act(() => result.current.toggleThemeScheme());
    expect(result.current.themeScheme).toBe('auto');

    act(() => result.current.toggleThemeScheme());
    expect(result.current.themeScheme).toBe('light');
  });
});

describe('useTheme - setSettings / 派生颜色', () => {
  it('setGrayscale / setColourWeakness 更新对应字段', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setGrayscale(true));
    expect(result.current.grayscaleMode).toBe(true);

    act(() => result.current.setColourWeakness(true));
    expect(result.current.colourWeaknessMode).toBe(true);
  });

  it('setSettings 部分字段：themeRadius 更新，其余保留', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({ themeRadius: 12 }));
    expect(result.current.themeRadius).toBe(12);
    expect(result.current.themeColor).toBe(defaultThemeSettings.themeColor);
  });

  it('updateThemeColors(primary, color) 更新 themeColor', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.updateThemeColors('primary', '#abcdef'));
    expect(result.current.themeColor).toBe('#abcdef');
    expect(result.current.themeColors.primary).toBe('#abcdef');
  });

  it('updateThemeColors(success, color) 更新 otherColor.success', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.updateThemeColors('success', '#00ff00'));
    expect(result.current.otherColor.success).toBe('#00ff00');
    expect(result.current.otherColor.error).toBe(defaultThemeSettings.otherColor.error);
  });

  it('updateThemeColors 在 recommendColor=true 时走推荐调色板', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({ recommendColor: true }));
    act(() => result.current.updateThemeColors('primary', '#ff0000'));

    // 取出后的颜色不一定等于原色，但必须是合法 hex
    expect(result.current.themeColor).toMatch(/^#[0-9a-fA-F]{6,8}$/);
  });

  it('setThemeLayout 更新 layout.mode 且保留 scrollMode', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setThemeLayout('horizontal'));
    expect(result.current.layout.mode).toBe('horizontal');
    expect(result.current.layout.scrollMode).toBe(defaultThemeSettings.layout.scrollMode);
  });
});

describe('useTheme - watermark', () => {
  it('watermark.visible=false 时 watermarkContent 为空字符串', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    expect(result.current.watermarkContent).toBe('');
  });

  it('watermark.visible=true 时返回 text', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() =>
      result.current.setSettings({
        watermark: { ...defaultThemeSettings.watermark, visible: true }
      })
    );

    expect(result.current.watermarkContent).toBe(defaultThemeSettings.watermark.text);
  });

  it('enableUserName=true 且 userName 存在 → 拼接用户名', () => {
    const { Wrapper } = createWrapper('Alice');
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({
      watermark: { ...defaultThemeSettings.watermark, visible: true, enableUserName: true }
    }));

    expect(result.current.watermarkContent).toBe(`${defaultThemeSettings.watermark.text} - Alice`);
  });

  it('enableUserName=true 但 userName 缺失 → 不拼接', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({
      watermark: { ...defaultThemeSettings.watermark, visible: true, enableUserName: true }
    }));

    expect(result.current.watermarkContent).toBe(defaultThemeSettings.watermark.text);
  });

  it('enableTime=true → 拼接格式化后的时间', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({
      watermark: { ...defaultThemeSettings.watermark, visible: true, enableTime: true }
    }));

    // 默认 timeFormat 是 'YYYY-MM-DD HH:mm'，包含字符串前缀
    expect(result.current.watermarkContent).toMatch(
      new RegExp(`^${defaultThemeSettings.watermark.text} - \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}$`)
    );
  });

  it('setWatermarkEnableUserName / setWatermarkEnableTime 更新对应字段', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setWatermarkEnableUserName(true));
    expect(result.current.watermark.enableUserName).toBe(true);

    act(() => result.current.setWatermarkEnableTime(true));
    expect(result.current.watermark.enableTime).toBe(true);
  });
});

describe('useTheme - updateWatermarkTimer', () => {
  it('visible=true && enableTime=true → resume', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({
      watermark: { ...defaultThemeSettings.watermark, visible: true, enableTime: true }
    }));

    act(() => result.current.updateWatermarkTimer());

    expect(nowState.resume).toHaveBeenCalled();
    expect(nowState.pause).not.toHaveBeenCalled();
  });

  it('visible=false 时 → pause', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.updateWatermarkTimer());

    expect(nowState.pause).toHaveBeenCalled();
    expect(nowState.resume).not.toHaveBeenCalled();
  });
});

describe('useTheme - reset', () => {
  it('恢复到默认设置', () => {
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useTheme(), { wrapper: Wrapper });

    act(() => result.current.setSettings({ themeColor: '#000', themeRadius: 99 }));
    expect(result.current.themeColor).toBe('#000');

    act(() => result.current.reset());
    expect(result.current.themeColor).toBe(defaultThemeSettings.themeColor);
    expect(result.current.themeRadius).toBe(defaultThemeSettings.themeRadius);
  });
});
