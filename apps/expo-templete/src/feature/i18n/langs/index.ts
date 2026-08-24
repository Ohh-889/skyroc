import type { LocaleType } from '../types';

import enUS from './en-US.json';
import zhCN from './zh-CN.json';

/**
 * 词条按语言整包打进 JS bundle，不走 i18next 的 backend 动态加载。
 *
 * 两个原因：一是 Metro 没有浏览器那种按需拉 chunk 的能力，动态 import 一个 JSON 拿到的仍然是打包
 * 进来的东西，绕一圈只换来一个 loading 态；二是词条整包也就几十 KB，为它引入一次异步就等于放弃
 * 「首帧语言是对的」这个前提。
 *
 * 语言多到十几门、每门几百 KB 时再考虑拆——那时用 `i18next-resources-to-backend` + `expo-asset`，
 * 并且要把 `setupI18n` 改成 async，同时接受首屏多一次闪烁。
 */
export const localeResources: Record<LocaleType, { translation: typeof zhCN }> = {
  'en-US': { translation: enUS as typeof zhCN },
  'zh-CN': { translation: zhCN }
};

/**
 * 词条的形状，以中文为准。
 *
 * `i18next.d.ts` 拿它去augment `CustomTypeOptions`，`t('profile.title')` 因此有补全、写错 key 会飘红。
 * 注意类型只认中文这一份：英文那份漏翻一条，TS 是发现不了的，加词条时两个文件一起改。
 */
export type LocaleMessages = typeof zhCN;
