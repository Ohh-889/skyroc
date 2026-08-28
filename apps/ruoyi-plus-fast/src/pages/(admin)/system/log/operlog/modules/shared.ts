import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchNumberEnum,
  optionalSearchText,
  optionalSearchTime,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import type { OperLogListParams } from '@/service/api/monitor-operlog';

/** URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getOperLogSearchInitialParams。 */
export const OperLogSearchSchema = z.object({
  ...searchPaginationShape,
  beginTime: optionalSearchTime,
  businessType: optionalSearchNumberEnum([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
  endTime: optionalSearchTime,
  isAsc: optionalSearchEnum(['asc', 'desc']),
  operIp: optionalSearchText,
  operName: optionalSearchText,
  orderByColumn: optionalSearchEnum([
    'businessType',
    'costTime',
    'operId',
    'operIp',
    'operName',
    'operTime',
    'status',
    'title'
  ]),
  status: optionalSearchNumberEnum([0, 1]),
  title: optionalSearchText
});

export type OperLogSearchQuery = z.infer<typeof OperLogSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getOperLogSearchInitialParams(pageSize: number): OperLogListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    beginTime: undefined,
    businessType: undefined,
    current: 1,
    endTime: undefined,
    operIp: undefined,
    operName: undefined,
    size: pageSize,
    status: undefined,
    title: undefined
  };
}

/** 表格参数写回 URL。 */
export function toOperLogSearchQuery(params: Partial<OperLogListParams>): OperLogSearchQuery {
  return OperLogSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeOperLogSearchParams(params: Partial<OperLogListParams>): OperLogListParams {
  const query = OperLogSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasOperLogFilters(params: Partial<OperLogListParams>) {
  return Boolean(
    params.beginTime ||
    params.businessType !== undefined ||
    params.endTime ||
    params.operIp ||
    params.operName ||
    params.status !== undefined ||
    params.title
  );
}
