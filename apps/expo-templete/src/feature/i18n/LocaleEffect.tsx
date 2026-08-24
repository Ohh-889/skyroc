import { useLocales } from 'expo-localization';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { i18n } from './i18n';
import { getLocale, localePreferenceAtom } from './locale-store';

/**
 * 让「跟随系统」在系统语言变了之后真的跟上。挂在根 layout，无渲染产出。
 *
 * `setLocalePreference` 只覆盖「用户主动切」这条路。安卓上用户可以在不杀进程的情况下去系统设置里
 * 改语言，此时偏好没变、`getLocale()` 的结果却变了，得有人把新值推给 i18next——就是这里。
 * （iOS 改系统语言会重启 App，走的是冷启动那条路，不需要它。）
 */
export const LocaleEffect = () => {
  const preference = useAtomValue(localePreferenceAtom);

  const locales = useLocales();

  useEffect(() => {
    const locale = getLocale();

    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [preference, locales]);

  return null;
};
