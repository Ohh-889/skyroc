import { setupI18n as setupCoreI18n } from '@skyroc/web-admin-i18n';
import type { LocaleSetupOptions } from '@skyroc/web-admin-i18n';

import { globalConfig } from '@/config';
import { localStg } from '@/utils/storage';

export { $t } from '@skyroc/web-admin-i18n';

/** Setup plugin i18n */
export async function setupI18n(options: LocaleSetupOptions<I18n.LangType> = {}) {
  await setupCoreI18n({
    defaultLocale: globalConfig.defaultLang,
    fallbackLocale: 'en-US',
    localeOptions: globalConfig.defaultLangOptions,
    missingWarn: import.meta.env.DEV,
    storage: {
      getLocale: () => localStg.get('lang'),
      setLocale: lang => localStg.set('lang', lang)
    },
    ...options
  });
}
