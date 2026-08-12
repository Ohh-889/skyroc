import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchId,
  optionalSearchText,
  optionalSearchTime,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import type { PostListParams } from '@/service/api/system-post';

/**
 * URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getPostSearchInitialParams。
 *
 * 部门主键统一收成数字：下拉选项的 value 是数字，从 URL 读回来的字符串对不上就选不中。
 */
export const PostSearchSchema = z.object({
  ...searchPaginationShape,
  beginTime: optionalSearchTime,
  belongDeptId: optionalSearchId,
  deptId: optionalSearchId,
  endTime: optionalSearchTime,
  isAsc: optionalSearchEnum(['asc', 'desc']),
  orderByColumn: optionalSearchEnum(['createTime', 'postSort']),
  postCategory: optionalSearchText,
  postCode: optionalSearchText,
  postName: optionalSearchText,
  status: optionalSearchEnum(['0', '1'])
});

export type PostSearchQuery = z.infer<typeof PostSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getPostSearchInitialParams(pageSize: number): PostListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    beginTime: undefined,
    belongDeptId: undefined,
    current: 1,
    deptId: undefined,
    endTime: undefined,
    postCategory: undefined,
    postCode: undefined,
    postName: undefined,
    size: pageSize,
    status: undefined
  };
}

/** 表格参数写回 URL。 */
export function toPostSearchQuery(params: Partial<PostListParams>): PostSearchQuery {
  return PostSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizePostSearchParams(params: Partial<PostListParams>): PostListParams {
  const query = PostSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasPostFilters(params: Partial<PostListParams>) {
  return Boolean(
    params.beginTime ||
      params.belongDeptId ||
      params.deptId ||
      params.endTime ||
      params.postCategory ||
      params.postCode ||
      params.postName ||
      params.status
  );
}
