import type { LocaleMessages } from './langs';

/**
 * 给 `t()` 上类型：key 有补全，写错的 key 直接飘红。
 *
 * 以中文那份为准（见 `langs/index.ts`）。也因此它只管得住「key 存不存在」，管不住「英文那份漏了
 * 一条」——加词条时两个文件一起改。
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: LocaleMessages;
    };
  }
}
