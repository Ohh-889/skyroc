import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchText,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import type { ClientListParams } from '@/service/api/system-client';

/** URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getClientSearchInitialParams。 */
export const ClientSearchSchema = z.object({
  ...searchPaginationShape,
  clientId: optionalSearchText,
  clientKey: optionalSearchText,
  isAsc: optionalSearchEnum(['asc', 'desc']),
  orderByColumn: optionalSearchEnum(['clientId', 'clientKey', 'id', 'status']),
  status: optionalSearchEnum(['0', '1'])
});

export type ClientSearchQuery = z.infer<typeof ClientSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getClientSearchInitialParams(pageSize: number): ClientListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    clientId: undefined,
    clientKey: undefined,
    current: 1,
    isAsc: 'desc',
    orderByColumn: 'id',
    size: pageSize,
    status: undefined
  };
}

/** 表格参数写回 URL。 */
export function toClientSearchQuery(params: Partial<ClientListParams>): ClientSearchQuery {
  return ClientSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeClientSearchParams(params: Partial<ClientListParams>): ClientListParams {
  const query = ClientSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasClientFilters(params: Partial<ClientListParams>) {
  return Boolean(params.clientId || params.clientKey || params.status);
}
