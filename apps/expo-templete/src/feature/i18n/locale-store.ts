import { createAtomWithStorage, getAtomValue, setAtomValue } from '@skyroc/core-state';
import { getLocales } from 'expo-localization';

import { MMKV_STORAGE } from '@/store/mmkv-storage';

import { FALLBACK_LOCALE, LOCALE_PREFERENCES, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from './config';
import type { LocalePreference, LocaleType } from './types';

/**
 * 用户选的语言偏好，`system` 表示跟随系统。
 *
 * 和 `themeModeAtom` 一模一样的取舍，理由也一样：存**偏好**而不是最终生效的语言，用户把手机语言 改掉之后 App 才会跟着变（见 `types.ts` 里 `LocalePreference` 的注释）。
 *
 * 落盘走 `MMKV_STORAGE`：MMKV 的读是同步的，冷启动第一帧就能拿到偏好。i18next 的初始化因此也能是 同步的（见
 * `i18n.ts`），首屏不会先用兜底语言画一遍再跳成用户选的语言——那一跳在长文案上是肉眼可见的。
 */
export const localePreferenceAtom = createAtomWithStorage<LocalePreference>(LOCALE_STORAGE_KEY, 'system', {
  storageName: MMKV_STORAGE,
  // 存过的值可能来自上一个版本（比如那时还支持日语），认不出来就当没选过，回落到跟随系统
  validate: raw => (LOCALE_PREFERENCES.includes(raw as LocalePreference) ? (raw as LocalePreference) : undefined)
});

/**
 * 按系统语言挑一门支持的语言。
 *
 * `getLocales()` 返回的是用户在系统设置里排好序的**列表**，不是单个值——「首选西班牙语、次选英语」 的用户应该看到英文而不是中文兜底，所以要顺着列表往下找，找到第一个能对上的为止。
 *
 * 两级匹配：先按完整 tag（`zh-Hant-TW` 精确命中 `zh-TW`），再按语言码（`zh-Hant-TW` → `zh` → `zh-CN`）。 只做后者的话，将来同时支持简繁体时会把繁体用户送进简体界面。
 *
 * 它是同步的（原生模块在启动时就把值准备好了），所以能在首帧前调用。
 */
export function resolveSystemLocale(): LocaleType {
  for (const locale of getLocales()) {
    const exact = SUPPORTED_LOCALES.find(item => item.toLowerCase() === locale.languageTag.toLowerCase());

    if (exact) return exact;

    const byLanguage = SUPPORTED_LOCALES.find(
      item => item.split('-')[0].toLowerCase() === (locale.languageCode ?? '').toLowerCase()
    );

    if (byLanguage) return byLanguage;
  }

  return FALLBACK_LOCALE;
}

/** React 之外同步读偏好 */
export function getLocalePreference() {
  return getAtomValue(localePreferenceAtom);
}

/**
 * 此刻真正生效的语言。React 之外（请求层、格式化函数、推送文案）都读它。
 *
 * 偏好是 `system` 时每次都重新问一遍系统——安卓上用户可以在不杀进程的情况下改系统语言， 缓存住这个结果会让 App 停在旧语言上。
 */
export function getLocale(): LocaleType {
  const preference = getLocalePreference();

  return preference === 'system' ? resolveSystemLocale() : preference;
}

/** 只写偏好，不做别的。真正的切换入口是 `i18n.ts` 的 `setLocalePreference` */
export function setStoredLocalePreference(preference: LocalePreference) {
  setAtomValue(localePreferenceAtom, preference);
}
