import { useAtomValue } from 'jotai';
import type { ThemeName } from 'uniwind';
import { useUniwind } from 'uniwind';

import type { ThemeMode } from './theme-store';
import { setThemeMode, themeModeAtom } from './theme-store';

/** 主题状态 */
export interface ThemeModeState {
  /** 用户选的模式，含 `system` */
  mode: ThemeMode;
  /** 此刻真正生效的明暗。`mode` 为 `system` 时它跟着系统走 */
  resolvedTheme: ThemeName;
  /** 切换模式，写偏好 + 通知 Uniwind */
  setMode: (mode: ThemeMode) => void;
}

/**
 * 读写主题。
 *
 * 两个来源各管一半，不要合并：偏好是自己的持久化状态（`themeModeAtom`），生效的明暗是 Uniwind 算出来的
 * （`system` 时由系统决定）。UI 上「选中哪个按钮」看前者，「现在是不是暗色」看后者。
 */
export function useThemeMode(): ThemeModeState {
  const mode = useAtomValue(themeModeAtom);

  const { theme } = useUniwind();

  return {
    mode,
    resolvedTheme: theme,
    setMode: setThemeMode
  };
}
