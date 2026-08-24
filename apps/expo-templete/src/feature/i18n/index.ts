/**
 * `i18next.d.ts` 给 `t()` 上类型，靠 tsconfig 的 include 自动生效，不用（也不能）在这里 import——
 * 它是纯类型文件，运行时没有对应的模块。
 */

export { FALLBACK_LOCALE, LOCALE_OPTIONS, LOCALE_PREFERENCES, SUPPORTED_LOCALES } from './config';
export {
  DEFAULT_CURRENCY,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  formatRelativeTime
} from './format';
export { i18n, setLocalePreference, setupI18n, t } from './i18n';
export { getLocale, getLocalePreference, localePreferenceAtom, resolveSystemLocale } from './locale-store';
export { LocaleEffect } from './LocaleEffect';
export type { DateInput, DateStyle, LocaleOption, LocalePreference, LocaleType } from './types';
export { useLocale } from './use-locale';
export type { LocaleState } from './use-locale';
