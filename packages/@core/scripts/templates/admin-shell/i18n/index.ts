// oxlint-disable-next-line import/no-unassigned-import
import './types/i18n';

// Atoms
export { currentLangOptionAtom, fallbackLangAtom, langAtom, localeOptionsAtom } from './atoms/lang';
// Config
export { defaultLangConfig } from './config/default';
export { default as LangEffect } from './features/lang/LangEffect';

export { default as LangSwitch } from './features/lang/LangSwitch';

// Hooks
export { useLang } from './hooks/use-lang';
export type { UseLangReturn } from './hooks/use-lang';

// Runtime
export { $t, getCurrentLang, i18n, loadLocaleMessages, reactI18nextInstance, setLng, setupI18n } from './i18n';

// Types
export type { LangConfig, LangOption, LangType, LocaleChangeHandler, LocaleSetupOptions, LocaleStorage } from './types';

// Utils
export { getLangFromStorage, getLangLabel, saveLangToStorage } from './utils/helpers';
