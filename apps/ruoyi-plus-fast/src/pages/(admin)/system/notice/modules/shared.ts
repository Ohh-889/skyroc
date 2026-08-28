import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchText,
  optionalSearchTime,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import type { NoticeListParams } from '@/service/api/system-notice';

/** URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getNoticeSearchInitialParams。 */
export const NoticeSearchSchema = z.object({
  ...searchPaginationShape,
  beginTime: optionalSearchTime,
  createByName: optionalSearchText,
  endTime: optionalSearchTime,
  noticeTitle: optionalSearchText,
  noticeType: optionalSearchEnum(['1', '2']),
  status: optionalSearchEnum(['0', '1'])
});

export type NoticeSearchQuery = z.infer<typeof NoticeSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getNoticeSearchInitialParams(pageSize: number): NoticeListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    beginTime: undefined,
    createByName: undefined,
    current: 1,
    endTime: undefined,
    noticeTitle: undefined,
    noticeType: undefined,
    size: pageSize,
    status: undefined
  };
}

/** 表格参数写回 URL。 */
export function toNoticeSearchQuery(params: Partial<NoticeListParams>): NoticeSearchQuery {
  return NoticeSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeNoticeSearchParams(params: Partial<NoticeListParams>): NoticeListParams {
  const query = NoticeSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasNoticeFilters(params: Partial<NoticeListParams>) {
  return Boolean(
    params.beginTime ||
    params.createByName ||
    params.endTime ||
    params.noticeTitle ||
    params.noticeType ||
    params.status
  );
}
