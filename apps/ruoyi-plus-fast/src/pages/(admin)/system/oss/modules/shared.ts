import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { z } from 'zod';

import type { OssListParams } from '@/service/api/system-oss';

/** 接口和 URL 共用同一份时间格式，不要在两边各自解析。 */
const OSS_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/** RangePicker 的值。它只是创建时间的一种渲染形态，参数、URL、接口三处一律用 beginTime / endTime 字符串。 */
export type OssCreatedRange = [Dayjs | null, Dayjs | null] | null;

/** 空串在 URL 上和“没填”是一回事，统一收敛成 undefined —— stringifyQuery 会直接把 undefined 丢掉。 */
const optionalText = z.string().trim().min(1).optional().catch(undefined);

const optionalId = z.coerce.number().int().positive().optional().catch(undefined);

/**
 * URL 查询串的契约，同时也是发请求前的清洗规则。
 *
 * parseQuery 出来的值一律是字符串，所以数字字段都要 coerce；手改 URL 的脏值一律兜成 undefined， 不该让页面白屏。这里不给默认值，默认值集中在
 * getOssSearchInitialParams。
 */
export const OssSearchSchema = z.object({
  beginTime: optionalText,
  createBy: optionalId,
  current: optionalId,
  endTime: optionalText,
  fileName: optionalText,
  /** 接口按精确值匹配后缀，大小写在这里抹平。 */
  fileSuffix: optionalText.transform(value => value?.toLowerCase()),
  isAsc: z.enum(['asc', 'desc']).optional().catch(undefined),
  orderByColumn: z
    .enum(['createTime', 'fileName', 'fileSuffix', 'originalName', 'ossId', 'service'])
    .optional()
    .catch(undefined),
  originalName: optionalText,
  service: optionalText,
  size: optionalId
});

export type OssSearchQuery = z.infer<typeof OssSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getOssSearchInitialParams(pageSize: number): OssListParams {
  return {
    // 这几个 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    beginTime: undefined,
    createBy: undefined,
    current: 1,
    endTime: undefined,
    fileName: undefined,
    fileSuffix: undefined,
    isAsc: 'desc',
    orderByColumn: 'createTime',
    originalName: undefined,
    service: undefined,
    size: pageSize
  };
}

/** 表格参数写回 URL。 */
export function toOssSearchQuery(params: Partial<OssListParams>): OssSearchQuery {
  return OssSearchSchema.parse(params);
}

/**
 * 发请求前的参数整形。
 *
 * 从 URL 回填的参数全是字符串，翻页和排序也可能带上脏值，统一过一遍 schema 再发出去。
 */
export function normalizeOssSearchParams(params: OssListParams): OssListParams {
  const query = OssSearchSchema.parse(params);

  return {
    ...query,
    current: query.current ?? 1,
    size: query.size ?? 10
  };
}

/** 字符串时间还原成 RangePicker 认识的 Dayjs，脏值按没填处理。 */
export function toOssCreatedRange(beginTime?: string, endTime?: string): OssCreatedRange {
  const begin = beginTime ? dayjs(beginTime) : null;
  const end = endTime ? dayjs(endTime) : null;

  return [begin?.isValid() ? begin : null, end?.isValid() ? end : null];
}

/** RangePicker 的值拆回字符串。 */
export function formatOssTime(value: Dayjs | null | undefined) {
  return value?.format(OSS_TIME_FORMAT);
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasOssFilters(params: Partial<OssListParams>) {
  return Boolean(
    params.beginTime ||
      params.createBy ||
      params.endTime ||
      params.fileName ||
      params.fileSuffix ||
      params.originalName ||
      params.service
  );
}
