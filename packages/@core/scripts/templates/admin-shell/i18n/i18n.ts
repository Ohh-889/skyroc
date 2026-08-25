import { setAtomValue } from '@skyroc/core-state';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { fallbackLangAtom, langAtom, localeOptionsAtom } from './atoms/lang';
import { defaultLangConfig } from './config/default';
import { localeResources } from './langs';
import type { LangOption, LangType, LocaleChangeHandler, LocaleSetupOptions, LocaleStorage } from './types';

// oxlint-disable-next-line import/no-named-as-default-member
export const i18n = i18next.use(initReactI18next);

export const reactI18nextInstance = i18n;

export const $t = i18n.t;

interface RuntimeConfig {
  fallbackLocale: LangType;
  localeOptions: LangOption[];
  onLocaleChange?: LocaleChangeHandler<LangType>;
  storage?: LocaleStorage<LangType>;
}

const runtimeConfig: RuntimeConfig = {
  fallbackLocale: defaultLangConfig.fallbackLang,
  localeOptions: defaultLangConfig.langOptions
};

function normalizeLocale(lang: string) {
  return lang as LangType;
}

function configureRuntime(options: LocaleSetupOptions<LangType>) {
  runtimeConfig.fallbackLocale = options.fallbackLocale ?? runtimeConfig.fallbackLocale;
  runtimeConfig.localeOptions = options.localeOptions ?? runtimeConfig.localeOptions;
  runtimeConfig.storage = options.storage ?? runtimeConfig.storage;
  runtimeConfig.onLocaleChange = options.onLocaleChange ?? runtimeConfig.onLocaleChange;

  setAtomValue(fallbackLangAtom, runtimeConfig.fallbackLocale);
  setAtomValue(localeOptionsAtom, runtimeConfig.localeOptions);
}

function resolveInitialLocale(options: LocaleSetupOptions<LangType>) {
  return options.defaultLocale ?? runtimeConfig.storage?.getLocale() ?? defaultLangConfig.defaultLang;
}

function loadAdminLocaleMessages(lang: LangType) {
  return localeResources[lang];
}

export function getLocaleOptions() {
  return runtimeConfig.localeOptions;
}

export function getFallbackLocale() {
  return runtimeConfig.fallbackLocale;
}

export function getStoredLocale() {
  return runtimeConfig.storage?.getLocale() ?? null;
}

export function saveLocale(lang: LangType) {
  runtimeConfig.storage?.setLocale(lang);
}

export async function setupI18n(options: LocaleSetupOptions<LangType> = {}) {
  configureRuntime(options);

  const locale = resolveInitialLocale(options);

  if (!i18n.isInitialized) {
    await i18n.init({
      fallbackLng: options.fallbackLocale ?? runtimeConfig.fallbackLocale,
      interpolation: {
        escapeValue: false
      },
      lng: locale,
      missingKeyHandler(lng, _namespace, key) {
        if (options.missingWarn && key.includes('.')) {
          console.warn(`[i18next] Not found '${key}' key in '${lng}' locale messages.`);
        }
      },
      react: {
        useSuspense: false
      },
      resources: options.resources,
      saveMissing: options.missingWarn,
      ...options.i18nextOptions
    });
  }

  await loadLocaleMessages(locale);
}

export async function loadLocaleMessages(lang: LangType) {
  const locale = normalizeLocale(lang);
  const messages = await loadAdminLocaleMessages(locale);

  i18n.addResourceBundle(locale, 'translation', messages, true, true);

  saveLocale(locale);

  await i18n.changeLanguage(locale);
  setAtomValue(langAtom, locale);

  await runtimeConfig.onLocaleChange?.(locale);
}

export async function setLng(lang: LangType) {
  await loadLocaleMessages(lang);
}

export function getCurrentLang() {
  return normalizeLocale(i18n.language || defaultLangConfig.defaultLang);
}
