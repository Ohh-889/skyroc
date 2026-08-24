// 取词条走的是 i18next 默认导出的单例，和 `i18n.ts` 初始化的是同一个
// oxlint-disable import/no-named-as-default-member
import i18next from 'i18next';

import { getLocale } from './locale-store';
import type { DateInput, DateStyle } from './types';

/**
 * 默认货币。
 *
 * **货币是业务数据的属性，不是界面语言的属性**——同一件商品对中文用户和英文用户都是人民币标价，
 * 不该因为切了英文就变成美元。所以 `formatCurrency` 的 currency 应该由接口下发，这个常量只是
 * 后端没给时的兜底。
 */
export const DEFAULT_CURRENCY = 'CNY';

/**
 * 五档日期格式。
 *
 * 业务页面只能从这几档里选，不要各自传 Intl options：同一个时间在列表页和详情页长得不一样，
 * 是最典型的「有 i18n 但没有统一入口」的症状。不够用就往这里加一档，别在页面里绕开。
 *
 * 故意不写 `timeZone`：不传就用设备时区，这在移动端几乎总是对的。要按公司总部时区显示，
 * 在这里统一加，别让每个调用方自己传。
 */
const DATE_STYLE_OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  date: { day: '2-digit', month: '2-digit', year: 'numeric' },
  dateTime: { day: '2-digit', hour: '2-digit', minute: '2-digit', month: '2-digit', year: 'numeric' },
  monthDay: { day: 'numeric', month: 'short' },
  time: { hour: '2-digit', minute: '2-digit' },
  weekday: { weekday: 'long' }
};

/**
 * 格式化器缓存。
 *
 * `new Intl.DateTimeFormat()` 在 Hermes 上要过一次原生桥并解析 locale，比想象中贵得多——
 * 一个 60 行的长列表每次滚动都重建一遍格式化器，掉帧是能测出来的。key 带上 locale，切语言后
 * 自然拿到另一组实例，旧的留着也没关系（就那么几个）。
 */
const dateTimeFormatters = new Map<string, Intl.DateTimeFormat>();

const numberFormatters = new Map<string, Intl.NumberFormat>();

function getDateTimeFormatter(locale: string, cacheKey: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}|${cacheKey}`;

  let formatter = dateTimeFormatters.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);

    dateTimeFormatters.set(key, formatter);
  }

  return formatter;
}

function getNumberFormatter(locale: string, cacheKey: string, options: Intl.NumberFormatOptions) {
  const key = `${locale}|${cacheKey}`;

  let formatter = numberFormatters.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);

    numberFormatters.set(key, formatter);
  }

  return formatter;
}

/**
 * 入参归一成 Date。
 *
 * 字符串只接受 ISO 8601。`new Date('2024/01/02 10:00')` 这种非标准写法在 Hermes 和各版本 iOS 上
 * 的行为不一致（时区解释能差 8 小时），后端返回这种格式就在 service 层转掉，别指望这里兜住。
 */
function toDate(value: DateInput) {
  return value instanceof Date ? value : new Date(value);
}

/** 日期 / 时间。档位见 `DATE_STYLE_OPTIONS` */
export function formatDate(value: DateInput, style: DateStyle = 'date', locale: string = getLocale()) {
  return getDateTimeFormatter(locale, style, DATE_STYLE_OPTIONS[style]).format(toDate(value));
}

/** 数字。默认按语言的分组符和小数点走：`1,234.5` / `1 234,5` */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale: string = getLocale()) {
  return getNumberFormatter(locale, options ? JSON.stringify(options) : 'default', options ?? {}).format(value);
}

/**
 * 货币。
 *
 * currency 请从接口数据里取，别用当前语言推（见 `DEFAULT_CURRENCY` 的注释）。
 */
export function formatCurrency(value: number, currency = DEFAULT_CURRENCY, locale: string = getLocale()) {
  return getNumberFormatter(locale, `currency:${currency}`, { currency, style: 'currency' }).format(value);
}

/** 百分比。传的是**比值**不是百分数：`0.128` → `12.8%` */
export function formatPercent(value: number, fractionDigits = 1, locale: string = getLocale()) {
  return getNumberFormatter(locale, `percent:${fractionDigits}`, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    style: 'percent'
  }).format(value);
}

/** 各时间单位的秒数，从大到小排，`formatRelativeTime` 自上而下找第一个够得着的 */
const RELATIVE_UNITS = [
  { key: 'year', seconds: 365 * 24 * 60 * 60 },
  { key: 'month', seconds: 30 * 24 * 60 * 60 },
  { key: 'day', seconds: 24 * 60 * 60 },
  { key: 'hour', seconds: 60 * 60 },
  { key: 'minute', seconds: 60 }
] as const;

/**
 * 相对时间：「3 分钟前」「2 天后」。
 *
 * **不用 `Intl.RelativeTimeFormat`**——Hermes 没有这个构造器（它只带了 Collator / DateTimeFormat /
 * NumberFormat 三样，可以在 hermesvm 的符号表里验证）。所以这里改用词条 + i18next 复数拼，
 * 也就顺带解决了另一个问题：`RelativeTimeFormat` 的措辞是固定的，产品想把「刚刚」改成「就在刚才」
 * 时，走词条改一个 key 就行，还能 OTA 下去。
 *
 * 复数依赖 `Intl.PluralRules`，那个同样是 polyfill 补的（见 `i18n.ts` 顶部的 import）。
 */
export function formatRelativeTime(value: DateInput, base: DateInput = Date.now()) {
  const diffSeconds = (toDate(base).getTime() - toDate(value).getTime()) / 1000;

  const absolute = Math.abs(diffSeconds);

  // 一分钟以内不报数字：`0 分钟前` 比「刚刚」既难读又不准
  if (absolute < RELATIVE_UNITS[RELATIVE_UNITS.length - 1].seconds) {
    return i18next.t('format.relative.now');
  }

  const direction = diffSeconds >= 0 ? 'past' : 'future';

  const unit = RELATIVE_UNITS.find(item => absolute >= item.seconds) ?? RELATIVE_UNITS[RELATIVE_UNITS.length - 1];

  const count = Math.floor(absolute / unit.seconds);

  // key 是拼出来的，绕不开 `t()` 的字面量类型，只能就地断言。`format.relative.*` 的形状由词条文件保证
  return i18next.t(`format.relative.${direction}.${unit.key}` as 'format.relative.now', { count });
}
