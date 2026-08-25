import type { LangConfig } from '../types';

/** Default language configuration */
export const defaultLangConfig: LangConfig = {
  defaultLang: 'zh-CN',
  fallbackLang: 'en-US',
  langOptions: [
    { key: 'zh-CN', label: '中文' },
    { key: 'en-US', label: 'English' }
  ]
};
