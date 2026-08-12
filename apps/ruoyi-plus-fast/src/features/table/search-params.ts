import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { z } from 'zod';

/**
 * 列表页查询参数的公共约定。
 *
 * 查询条件要写进 URL 才能刷新不丢、链接可分享，而 URL 上只有字符串。 所以每个列表页都需要同一套东西：把脏字符串收敛成干净参数的 zod
 * 片段，以及时间区间在 Dayjs 和字符串之间的互转。
 */

/** 接口和 URL 共用同一份时间格式，不要在两边各自解析。 */
export const SEARCH_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/** RangePicker 的值。它只是时间区间的一种渲染形态，参数、URL、接口三处一律用字符串。 */
export type SearchDateRange = [Dayjs | null, Dayjs | null] | null;

/** 时间区间的取值口径：整天把两端补到 00:00:00 / 23:59:59，精确则用户选到几秒就是几秒。 */
export type SearchRangeGranularity = 'day' | 'second';

/** 字符串时间还原成 RangePicker 认识的 Dayjs，脏值按没填处理。 */
export function toSearchDateRange(beginTime?: string, endTime?: string): SearchDateRange {
  const begin = beginTime ? dayjs(beginTime) : null;
  const end = endTime ? dayjs(endTime) : null;

  return [begin?.isValid() ? begin : null, end?.isValid() ? end : null];
}

/** 区间起点转字符串。 */
export function formatSearchRangeBegin(value: Dayjs | null | undefined, granularity: SearchRangeGranularity) {
  if (!value) return undefined;

  return (granularity === 'day' ? value.startOf('day') : value).format(SEARCH_TIME_FORMAT);
}

/** 区间终点转字符串。 */
export function formatSearchRangeEnd(value: Dayjs | null | undefined, granularity: SearchRangeGranularity) {
  if (!value) return undefined;

  return (granularity === 'day' ? value.endOf('day') : value).format(SEARCH_TIME_FORMAT);
}

/** URL 上的可选文本。空串和纯空白都等同于没填，收敛成 undefined —— stringifyQuery 会直接把 undefined 丢掉。 */
export const optionalSearchText = z.string().trim().min(1).optional().catch(undefined);

/** URL 上的可选正整数。parseQuery 出来的一律是字符串，所以要 coerce。 */
export const optionalSearchId = z.coerce.number().int().positive().optional().catch(undefined);

/** URL 上的可选日期时间。解析不出来的按没填处理，别把脏值透传给接口。 */
export const optionalSearchTime = optionalSearchText.transform(value =>
  value && dayjs(value).isValid() ? value : undefined
);

/** URL 上的可选枚举，取值不在白名单里就按没填处理。 */
export function optionalSearchEnum<const T extends readonly [string, ...string[]]>(values: T) {
  return z.enum(values).optional().catch(undefined);
}

/**
 * URL 上的可选数字枚举。
 *
 * 有些接口的状态码是数字而不是字符串，从 URL 读回来却一律是字符串，所以要先转数字再核对白名单。 空串是“没填”而不是 0，单独挡掉。
 */
export function optionalSearchNumberEnum<const T extends readonly [number, ...number[]]>(values: T) {
  const allowed = values as readonly number[];

  return z
    .union([z.number(), z.string()])
    .transform(value => (typeof value === 'string' && value.trim() === '' ? Number.NaN : Number(value)))
    .refine((value): value is T[number] => allowed.includes(value))
    .optional()
    .catch(undefined);
}

/** 分页参数在 URL 上的契约，各页 schema 直接摊开复用。 */
export const searchPaginationShape = {
  current: optionalSearchId,
  size: optionalSearchId
};

/** URL 上没带分页时回落到默认值。apiParams 一定会给 size，这里的兜底只在参数被手动删干净时才用得上。 */
export function resolveSearchPagination(query: { current?: number; size?: number }) {
  return {
    current: query.current ?? 1,
    size: query.size ?? 10
  };
}
