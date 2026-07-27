// oxlint-disable import/no-unassigned-import
import { locale } from 'dayjs';

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

const localeMap: Record<I18n.LangType, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en'
};

export function syncLocales(lang: I18n.LangType) {
  locale(localeMap[lang]);
}
