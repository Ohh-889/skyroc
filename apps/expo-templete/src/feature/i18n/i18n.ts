// Hermes 只实现了 Intl 的 Collator / DateTimeFormat / NumberFormat 三样，**没有 Intl.PluralRules**
// （拆开 RN 带的 hermesvm 看符号表就能验证），而 i18next 从 v21 起的复数解析完全建在它上面。
//
// 缺了它的表现很阴：i18next 会 catch 住构造失败，回落到一条硬编码规则
// `count === 1 ? 'one' : 'other'`（源码里的 `dummyRule`）。那恰好就是英文的真实规则，所以
// **英文一切正常**；中文只有 `other` 一档、词条里根本没有 `_one`，于是 count 恰好为 1 时
// 查不到 key，界面上直接渲染出 `xxx.plural.sample` 这串原始 key。
//
// 也就是说：出问题的是默认语言、只在 count 为 1 时出现、英文用例还全绿。最容易漏测的那一类。
//
// 这个 polyfill 必须在 i18next 之前求值，也因此它是整个模板里唯一一句 unassigned import。
// oxlint-disable-next-line import/no-unassigned-import
import 'intl-pluralrules';

// 整份文件都在用 i18next 默认导出的**单例**调方法。规则想让人改成具名导入，但那样拿到的是
// 「操作默认单例的自由函数」，语义一样、可读性更差，而且 `use()` 的链式调用直接就断了
// oxlint-disable import/no-named-as-default-member
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { FALLBACK_LOCALE } from './config';
import { formatCurrency, formatDate, formatNumber, formatPercent, formatRelativeTime } from './format';
import { localeResources } from './langs';
import { getLocale, setStoredLocalePreference } from './locale-store';
import type { DateStyle, LocalePreference } from './types';

/** i18next 单例。页面请用 `useTranslation()`，这个导出是给 React 之外的调用方（请求层、推送文案）用的 */
export const i18n = i18next;

/**
 * React 之外取词条。
 *
 * 它**不会**跟着语言变化重渲染任何东西——只在调用的那一刻取值。放进模块级常量
 * （`const TITLE = t('x')`）就等于把首次启动时的语言焊死了，切语言后再也不变。
 * 组件里一律用 `useTranslation()`。
 */
export const t = i18next.t;

let initialized = false;

/**
 * 把格式化函数接进 i18next 的插值语法，让词条里能写 `{{at, date(style: dateTime)}}`。
 *
 * 目的是**只有一个入口**：不管文案是在 JSX 里调 `formatDate` 拼出来的，还是在 JSON 里用插值写的，
 * 走的都是 `feature/i18n/format` 那一份实现。少了这一步，翻译同学一旦在词条里自己拼日期，
 * 格式就和界面其它地方对不上了。
 *
 * i18next 自带的 `relativetime` / `list` 格式化器**不能用**：它们建在 Hermes 没有的
 * `Intl.RelativeTimeFormat` / `Intl.ListFormat` 上，调用会直接抛。
 */
function registerFormatters() {
  const formatter = i18next.services.formatter;

  if (!formatter) return;

  formatter.add('date', (value, lng, options) => formatDate(value, (options.style as DateStyle) ?? 'date', lng));

  formatter.add('number', (value, lng) => formatNumber(value, undefined, lng));

  formatter.add('currency', (value, lng, options) => formatCurrency(value, options.currency as string, lng));

  formatter.add('percent', (value, lng, options) => formatPercent(value, Number(options.digits ?? 1), lng));

  formatter.add('relative', value => formatRelativeTime(value));
}

/**
 * 初始化 i18next。在根 layout 的**模块顶层**调一次，和 `applyStoredThemeMode()` 并排。
 *
 * 关键是 `initImmediate: false`：i18next 默认把初始化推到下一个 tick（为了给异步 backend 让路），
 * 那样首帧渲染时 `t()` 还什么都取不到，长文案会先空一帧再跳出来。词条本来就是打包进来的，
 * 没有任何要等的东西，所以直接要求同步完成——配合 MMKV 的同步读，第一帧就是用户选的语言。
 *
 * 别把它改成 `await`：`setupI18n()` 一旦变成异步，上面这条链就断了。
 */
export function setupI18n() {
  if (initialized) return;

  initialized = true;

  i18next.use(initReactI18next).init({
    fallbackLng: FALLBACK_LOCALE,
    initImmediate: false,
    // RN 没有 innerHTML 这条注入路径，转义只会让文案里的引号变成 &quot;
    interpolation: { escapeValue: false },
    lng: getLocale(),
    react: {
      // 词条是同步就位的，没有要 suspend 的东西；开着反而要求每个用 t 的组件外面都套 Suspense
      useSuspense: false
    },
    resources: localeResources,
    // 缺 key 时返回 key 本身而不是空串：界面上看到 `profile.titel` 一眼就知道是拼错了，
    // 看到一片空白只会以为是布局出了问题
    returnNull: false
  });

  registerFormatters();
}

/**
 * 切语言。写偏好和通知 i18next 必须绑在一起，别在页面里分开调：只写偏好的话界面不变，
 * 只调 changeLanguage 的话下次冷启动又跳回去了。
 *
 * 不需要重启，也不重挂任何组件——react-i18next 让订阅了 `t` 的组件重渲染就完事了。
 */
export function setLocalePreference(preference: LocalePreference) {
  setStoredLocalePreference(preference);

  i18next.changeLanguage(getLocale());
}
