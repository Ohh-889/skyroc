import type { InitOptions, Resource } from 'i18next';

/** Supported language code. */
export type LangType = 'en-US' | 'zh-CN';

/** Display option for a language switcher. */
export interface LangOption<TLang extends string = LangType> {
  /** Menu key used by UI components and locale switching. */
  key: TLang;
  /** Human readable language label. */
  label: string;
}

/** Runtime language configuration. */
export interface LangConfig<TLang extends string = LangType> {
  /** Initial language used when storage does not contain a valid value. */
  defaultLang: TLang;
  /** Language used when a translation key is missing. */
  fallbackLang: TLang;
  /** Languages exposed to language switch UI. */
  langOptions: LangOption<TLang>[];
}

/** Storage adapter owned by the consuming app. */
export interface LocaleStorage<TLang extends string = LangType> {
  /** Read the persisted locale. */
  getLocale: () => TLang | null;
  /** Persist the selected locale. */
  setLocale: (lang: TLang) => void;
}

/** Callback fired after the active locale changes. */
export type LocaleChangeHandler<TLang extends string = LangType> = (lang: TLang) => void | Promise<void>;

/** i18n setup options shared by apps. */
export interface LocaleSetupOptions<TLang extends string = LangType> {
  /** Initial language, usually resolved from app storage. */
  defaultLocale?: TLang;
  /** Fallback language for i18next. */
  fallbackLocale?: TLang;
  /** Extra i18next init options. */
  i18nextOptions?: Omit<InitOptions, 'fallbackLng' | 'lng' | 'resources'>;
  /** Language options exposed to shared hooks. */
  localeOptions?: LangOption<TLang>[];
  /** Whether missing translation keys should be logged. */
  missingWarn?: boolean;
  /** Side effects that must run after a locale changes. */
  onLocaleChange?: LocaleChangeHandler<TLang>;
  /** Preloaded i18next resources. */
  resources?: Resource;
  /** App-owned persistence adapter. */
  storage?: LocaleStorage<TLang>;
}
