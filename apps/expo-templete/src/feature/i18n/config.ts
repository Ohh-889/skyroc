import type { LocaleOption, LocalePreference, LocaleType } from './types';

/**
 * 兜底语言。
 *
 * 词条缺失时按它取值，系统语言不在支持列表里时也落到它。选中文是因为这个模板的默认受众是中文用户—— 换成英文只要改这一个常量。
 */
export const FALLBACK_LOCALE: LocaleType = 'zh-CN';

/** 语言选择器的选项，顺序即展示顺序 */
export const LOCALE_OPTIONS: readonly LocaleOption[] = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
];

/** 偏好三态，顺序即展示顺序。和 `THEME_MODES` 同一个套路 */
export const LOCALE_PREFERENCES: readonly LocalePreference[] = ['system', 'zh-CN', 'en-US'];

/** 支持的语言列表，由选项推出来，避免两处各写一份 */
export const SUPPORTED_LOCALES: readonly LocaleType[] = LOCALE_OPTIONS.map(option => option.value);

/** MMKV 里存语言偏好的 key */
export const LOCALE_STORAGE_KEY = 'i18n.locale';
