import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultThemeSettings } from '@shell/theme/config/default';
import { themeSettingsAtom } from '@shell/theme/hooks';
import { defineThemeOverrides, setupTheme } from '@shell/theme/setup';

function createStorageMock(initial: Record<string, unknown> = {}) {
  const store: Record<string, unknown> = { ...initial };
  return {
    get: vi.fn((key: string) => store[key]),
    set: vi.fn((key: string, value: unknown) => {
      store[key] = value;
    }),
    /** Test helper: read final store state */
    _store: store
  };
}

beforeEach(() => {
  // 重置 atom.init 避免测试间相互污染
  themeSettingsAtom.init = defaultThemeSettings;
  window.localStorage.clear();
  vi.stubEnv('DEV', true);
  vi.stubEnv('PROD', false);
});

afterEach(() => {
  themeSettingsAtom.init = defaultThemeSettings;
  window.localStorage.clear();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('defineThemeOverrides', () => {
  it('原样返回输入，类型即身份', () => {
    const overrides = { themeColor: '#abc' as string };
    expect(defineThemeOverrides(overrides)).toBe(overrides);
  });
});

describe('setupTheme - 开发环境', () => {
  it('默认开发环境直接使用默认配置且不读 storage', () => {
    const storage = createStorageMock();

    setupTheme({ storage });

    expect(themeSettingsAtom.init).toBe(defaultThemeSettings);
    expect(storage.get).not.toHaveBeenCalled();
    expect(storage.set).not.toHaveBeenCalled();
  });

  it('未传 isProd 时跟随 import.meta.env.PROD', () => {
    const storage = createStorageMock();

    vi.stubEnv('DEV', false);
    vi.stubEnv('PROD', true);

    setupTheme({
      buildTime: '2025-01-01',
      storage
    });

    expect(storage.get).toHaveBeenCalledWith('themeSettings');
    expect(storage.set).toHaveBeenCalledWith('overrideThemeFlag', '2025-01-01');
  });
});

describe('setupTheme - 生产环境', () => {
  it('缺少 buildTime 时不写入版本覆盖标记', () => {
    const storage = createStorageMock();

    setupTheme({
      isProd: true,
      storage
    });

    expect(storage.get).toHaveBeenCalledWith('themeSettings');
    expect(storage.get).not.toHaveBeenCalledWith('overrideThemeFlag');
    expect(storage.set).not.toHaveBeenCalled();
  });

  it('未传 storage 时使用外部传入的 storagePrefix 创建默认 localStorage', () => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('PROD', true);

    setupTheme({
      buildTime: '2025-01-01',
      overrides: { themeColor: '#ff0000' },
      storagePrefix: 'skyroc__'
    });

    expect(window.localStorage.getItem('skyroc__overrideThemeFlag')).toBe(JSON.stringify('2025-01-01'));

    const init = themeSettingsAtom.init as Theme.ThemeSetting;
    expect(init.themeColor).toBe('#ff0000');
  });

  it('未传 storagePrefix 时使用默认存储前缀', () => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('PROD', true);

    setupTheme({
      buildTime: '2025-01-01'
    });

    expect(window.localStorage.getItem('SR_overrideThemeFlag')).toBe(JSON.stringify('2025-01-01'));
  });

  it('无缓存时使用默认配置 + overrides，并写入 buildTime', () => {
    const storage = createStorageMock();

    setupTheme({
      isProd: true,
      buildTime: '2025-01-01',
      overrides: { themeColor: '#ff0000' },
      storage
    });

    expect(storage.get).toHaveBeenCalledWith('themeSettings');
    expect(storage.get).toHaveBeenCalledWith('overrideThemeFlag');
    expect(storage.set).toHaveBeenCalledWith('overrideThemeFlag', '2025-01-01');

    const init = themeSettingsAtom.init as Theme.ThemeSetting;
    expect(init.themeColor).toBe('#ff0000');
    expect(init.themeRadius).toBe(defaultThemeSettings.themeRadius);
  });

  it('存在缓存时优先用缓存（缺失字段从默认补齐）', () => {
    const cached = { themeColor: '#0000ff', themeRadius: 12 } as Partial<Theme.ThemeSetting>;
    const storage = createStorageMock({
      themeSettings: cached,
      overrideThemeFlag: '2025-01-01'
    });

    setupTheme({
      isProd: true,
      buildTime: '2025-01-01',
      storage
    });

    const init = themeSettingsAtom.init as Theme.ThemeSetting;
    expect(init.themeColor).toBe('#0000ff');
    expect(init.themeRadius).toBe(12);
    expect(init.themeScheme).toBe(defaultThemeSettings.themeScheme);
  });

  it('overrideThemeFlag 与 buildTime 一致时跳过 overrides 强制覆盖', () => {
    const storage = createStorageMock({
      themeSettings: { themeColor: '#cached' } as Partial<Theme.ThemeSetting>,
      overrideThemeFlag: '2025-01-01'
    });

    setupTheme({
      isProd: true,
      buildTime: '2025-01-01',
      overrides: { themeColor: '#override' },
      storage
    });

    const init = themeSettingsAtom.init as Theme.ThemeSetting;
    // overrides 不生效，仍取缓存值
    expect(init.themeColor).toBe('#cached');
    // 也不再写 overrideThemeFlag
    expect(storage.set).not.toHaveBeenCalled();
  });

  it('overrideThemeFlag 与 buildTime 不一致时让 overrides 生效并刷新 flag', () => {
    const storage = createStorageMock({
      themeSettings: { themeColor: '#cached' } as Partial<Theme.ThemeSetting>,
      overrideThemeFlag: '2024-12-01'
    });

    setupTheme({
      isProd: true,
      buildTime: '2025-01-01',
      overrides: { themeColor: '#override' },
      storage
    });

    const init = themeSettingsAtom.init as Theme.ThemeSetting;
    expect(init.themeColor).toBe('#override');
    expect(storage.set).toHaveBeenCalledWith('overrideThemeFlag', '2025-01-01');
  });
});
