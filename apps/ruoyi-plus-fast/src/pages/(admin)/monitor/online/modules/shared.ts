import { z } from 'zod';

import { optionalSearchText, resolveSearchPagination, searchPaginationShape } from '@/features/table/search-params';
import type { OnlineSessionListParams } from '@/service/api/monitor-online';

/** URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getOnlineSearchInitialParams。 */
export const OnlineSearchSchema = z.object({
  ...searchPaginationShape,
  ipaddr: optionalSearchText,
  userName: optionalSearchText
});

export type OnlineSearchQuery = z.infer<typeof OnlineSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getOnlineSearchInitialParams(pageSize: number): OnlineSessionListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    current: 1,
    ipaddr: undefined,
    size: pageSize,
    userName: undefined
  };
}

/** 表格参数写回 URL。 */
export function toOnlineSearchQuery(params: Partial<OnlineSessionListParams>): OnlineSearchQuery {
  return OnlineSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeOnlineSearchParams(params: Partial<OnlineSessionListParams>): OnlineSessionListParams {
  const query = OnlineSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasOnlineFilters(params: Partial<OnlineSessionListParams>) {
  return Boolean(params.ipaddr || params.userName);
}
