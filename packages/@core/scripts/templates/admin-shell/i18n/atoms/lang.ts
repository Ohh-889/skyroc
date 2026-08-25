import { atom } from 'jotai';
import { defaultLangConfig } from '../config/default';
import type { LangOption, LangType } from '../types';

/** Current language atom. */
export const langAtom = atom<LangType>(defaultLangConfig.defaultLang);

/** Language options shared by language switch UI. */
export const localeOptionsAtom = atom<LangOption[]>(defaultLangConfig.langOptions);

/** Fallback language atom. */
export const fallbackLangAtom = atom<LangType>(defaultLangConfig.fallbackLang);

/** Derived atom: Current language option */
export const currentLangOptionAtom = atom(get => {
  const lang = get(langAtom);
  const options = get(localeOptionsAtom);

  return options.find(opt => opt.key === lang);
});
