import { useAtom, useAtomValue } from 'jotai';
import { currentLangOptionAtom, fallbackLangAtom, langAtom, localeOptionsAtom } from '../atoms/lang';
import { getFallbackLocale, getLocaleOptions, loadLocaleMessages } from '../i18n';
import type { LangOption, LangType } from '../types';

export interface UseLangReturn {
  /** Change the current language. */
  changeLocale: (lang: LangType) => void;
  /** Current language option. */
  currentOption: LangOption | undefined;

  /** Fallback language. */
  fallbackLang: LangType;
  /** Check whether the supplied language is active. */
  isCurrentLang: (lang: LangType) => boolean;

  /** Current language. */
  locale: LangType;
  /** Language options for switch UI. */
  localeOptions: LangOption[];

  /** Alias of changeLocale. */
  setLocale: (lang: LangType) => void;
}

/** Hook for language management */
export function useLang(): UseLangReturn {
  const [locale, setLocale] = useAtom(langAtom);
  const currentOption = useAtomValue(currentLangOptionAtom);
  const localeOptions = useAtomValue(localeOptionsAtom);
  const fallbackLang = useAtomValue(fallbackLangAtom);

  function changeLocale(lang: LangType) {
    setLocale(lang);
    loadLocaleMessages(lang);
  }

  return {
    locale,
    currentOption,
    localeOptions: localeOptions.length > 0 ? localeOptions : getLocaleOptions(),
    fallbackLang: fallbackLang || getFallbackLocale(),
    changeLocale,
    setLocale: changeLocale,
    isCurrentLang: (lang: LangType) => locale === lang
  };
}
