import { getStoredLocale, saveLocale } from '../i18n';
import type { LangOption, LangType } from '../types';

/** Get language from storage */
export function getLangFromStorage(): LangType | null {
  return getStoredLocale();
}

/** Save language to storage */
export function saveLangToStorage(lang: LangType): void {
  saveLocale(lang);
}

/** Get language label */
export function getLangLabel(lang: LangType, options: LangOption[]): string {
  const option = options.find(opt => opt.key === lang);
  return option?.label || lang;
}
