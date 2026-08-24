import { useLocales } from 'expo-localization';
import { useAtomValue } from 'jotai';

import { LOCALE_OPTIONS } from './config';
import { setLocalePreference } from './i18n';
import { localePreferenceAtom, resolveSystemLocale } from './locale-store';
import type { LocaleOption, LocalePreference, LocaleType } from './types';

/** 语言状态 */
export interface LocaleState {
  /** 此刻真正生效的语言。`preference` 为 `system` 时它跟着系统走 */
  locale: LocaleType;
  /** 语言选择器的选项 */
  options: readonly LocaleOption[];
  /** 用户选的偏好，含 `system` */
  preference: LocalePreference;
  /** 切语言。当场生效，不重挂组件 */
  setPreference: (preference: LocalePreference) => void;
  /** 系统语言映射到支持列表后的结果，「跟随系统」那一项的副标题用得上 */
  systemLocale: LocaleType;
}

/**
 * 读写语言。
 *
 * 和 `useThemeMode` 一个路子，两个来源各管一半：偏好是自己的持久化状态（`localePreferenceAtom`），
 * 生效的语言由它加上系统语言算出来。UI 上「选中哪一项」看 `preference`，「现在在说什么语言」看 `locale`。
 *
 * 这里**不返回 `t`**：取词条请各自 `useTranslation()`，那是 react-i18next 精确订阅的入口，
 * 从这里透传只会让所有用到语言状态的组件在切系统语言时一起重渲染。
 */
export function useLocale(): LocaleState {
  const preference = useAtomValue(localePreferenceAtom);

  // 订阅系统语言：安卓允许用户不杀进程直接改系统语言，不订阅的话「跟随系统」会停在旧值上。
  // iOS 改语言会重启 App，这一行在 iOS 上等于白拿
  useLocales();

  const systemLocale = resolveSystemLocale();

  return {
    locale: preference === 'system' ? systemLocale : preference,
    options: LOCALE_OPTIONS,
    preference,
    setPreference: setLocalePreference,
    systemLocale
  };
}
