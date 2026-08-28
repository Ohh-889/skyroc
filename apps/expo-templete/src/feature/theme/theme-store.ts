import { createAtomWithStorage, getAtomValue, setAtomValue } from '@skyroc/core-state';
import { Uniwind } from 'uniwind';

import { MMKV_STORAGE } from '@/store/mmkv-storage';

/** 主题三态。`system` 跟随系统，另外两个是用户的手动覆盖 */
export type ThemeMode = 'dark' | 'light' | 'system';

const THEME_STORAGE_KEY = 'theme.mode';

export const THEME_MODES: readonly ThemeMode[] = ['system', 'light', 'dark'];

/**
 * 用户选的主题模式，`system` 表示跟随系统。
 *
 * 存的是**偏好**而不是最终生效的明暗：存 `dark` 和存「跟随系统、此刻系统是暗色」是两件事， 只落最终值的话，用户在系统里切回浅色后 App 会固执地继续暗着。
 *
 * 落盘走 `MMKV_STORAGE`：MMKV 的读是同步的，冷启动第一帧就能拿到偏好，不会先按系统色画一帧再跳成用户选的色。 换成 AsyncStorage 这类异步存储就做不到，第一帧只能拿默认值。
 */
export const themeModeAtom = createAtomWithStorage<ThemeMode>(THEME_STORAGE_KEY, 'system', {
  storageName: MMKV_STORAGE,
  // 存过的值可能来自上一个版本，认不出来就当没选过，回落到跟随系统
  validate: raw => (THEME_MODES.includes(raw as ThemeMode) ? (raw as ThemeMode) : undefined)
});

export function getThemeMode() {
  return getAtomValue(themeModeAtom);
}

/**
 * 切主题。写偏好和通知 Uniwind 必须绑在一起，别在页面里分开调。
 *
 * `Uniwind.setTheme` 在原生端会一路调到 `Appearance.setColorScheme`，所以这一次调用同时改掉了 三样东西：uniwind 的 className 取值、React Navigation 的
 * `ThemeProvider`、以及 `StatusBar style="auto"` ——它们读的都是 `useColorScheme()`。也因此这些地方**不需要**再各自订阅一遍主题。
 */
export function setThemeMode(mode: ThemeMode) {
  setAtomValue(themeModeAtom, mode);

  Uniwind.setTheme(mode);
}

/**
 * 把落盘的偏好喂给 Uniwind。在根 layout 的模块顶层调一次。
 *
 * 必须早于首帧：Uniwind 自己只认系统色，冷启动时不告诉它用户选过 dark，第一帧就会按系统的浅色画出来。
 */
export function applyStoredThemeMode() {
  Uniwind.setTheme(getThemeMode());
}
