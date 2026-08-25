import { createStorage } from '@skyroc/utils/web';
import { defaultThemeSettings } from './config/default';
import { themeSettingsAtom } from './hooks';
import { mergeThemeSettings } from './utils/settings';

const DEFAULT_THEME_STORAGE_PREFIX = 'SR_';

interface ThemeStorageSchema {
  darkMode: boolean;
  overrideThemeFlag: string;
  themeColor: string;
  themeSettings: Theme.ThemeSetting;
}

/**
 * Storage adapter interface
 *
 * 与 createStorage 返回的对象兼容，也可以传宿主自定义 storage。
 */
interface ThemeStorage {
  get: (...args: any[]) => any;
  set: (...args: any[]) => void;
}

interface SetupThemeOptions {
  /** 当前构建时间，用于检测缓存覆盖（生产环境需要） */
  buildTime?: string;

  /** 是否生产环境（默认 import.meta.env.PROD） */
  isProd?: boolean;

  /** 主题配置覆盖项，发布新版本时可强制覆盖用户缓存的某些配置 */
  overrides?: Partial<Theme.ThemeSetting>;

  /** 存储适配器，用于读写缓存的主题配置；传入后会优先于 storagePrefix */
  storage?: ThemeStorage;

  /** 默认存储适配器的 key 前缀 */
  storagePrefix?: string;
}

let _storage: ThemeStorage | null = null;

export function getInternalStorage(): ThemeStorage | null {
  return _storage;
}

/**
 * 一次调用完成主题初始化
 *
 * 在 app 入口或 AntdProvider 之前调用，自动处理： - 默认配置加载 - localStorage 缓存读取（生产环境） - 版本覆盖检测 - Jotai atom 初始化
 *
 * @example
 *   ```ts
 *   import { setupTheme } from '@shell/theme';
 *
 *   setupTheme({
 *     buildTime: BUILD_TIME
 *   });
 *   ```
 */
export function setupTheme(options: SetupThemeOptions = {}) {
  const {
    buildTime,
    isProd = import.meta.env.PROD,
    overrides,
    storage,
    storagePrefix = DEFAULT_THEME_STORAGE_PREFIX
  } = options;
  const themeStorage = storage ?? createDefaultStorage(storagePrefix);

  _storage = themeStorage;

  // 开发环境：直接使用默认配置
  if (!isProd) {
    themeSettingsAtom.init = defaultThemeSettings;
    return;
  }

  // 生产环境：从缓存加载 + 版本覆盖检测
  const cachedSettings = themeStorage.get('themeSettings');

  let settings = mergeThemeSettings(cachedSettings, defaultThemeSettings);

  const isOverride = buildTime ? themeStorage.get('overrideThemeFlag') === buildTime : false;

  if (!isOverride) {
    settings = mergeThemeSettings(overrides, settings);

    if (buildTime) {
      themeStorage.set('overrideThemeFlag', buildTime);
    }
  }

  themeSettingsAtom.init = settings;
}

function createDefaultStorage(storagePrefix: string) {
  return createStorage<ThemeStorageSchema>('local', storagePrefix);
}

/**
 * 类型安全的主题覆盖配置定义辅助函数
 *
 * @example
 *   ```ts
 *   export const themeOverrides = defineThemeOverrides({
 *     themeColor: '#6366F1',
 *     themeScheme: 'dark'
 *   });
 *   ```
 */
export function defineThemeOverrides(overrides: Partial<Theme.ThemeSetting>): Partial<Theme.ThemeSetting> {
  return overrides;
}
