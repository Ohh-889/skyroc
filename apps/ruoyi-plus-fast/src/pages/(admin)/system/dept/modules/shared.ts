import { z } from 'zod';

import { optionalSearchEnum, optionalSearchText } from '@/features/table/search-params';
import type { DeptListParams } from '@/service/api/system-dept';

/**
 * URL 查询串的契约，同时也是发请求前的清洗规则。
 *
 * 部门是一棵树，接口一次返回全量，没有分页参数，所以这里也不带 current / size。
 */
export const DeptSearchSchema = z.object({
  deptCategory: optionalSearchText,
  deptName: optionalSearchText,
  status: optionalSearchEnum(['0', '1'])
});

export type DeptSearchQuery = z.infer<typeof DeptSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getDeptSearchInitialParams(): DeptListParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    deptCategory: undefined,
    deptName: undefined,
    status: undefined
  };
}

/** 表格参数写回 URL。 */
export function toDeptSearchQuery(params: Partial<DeptListParams>): DeptSearchQuery {
  return DeptSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeDeptSearchParams(params: Partial<DeptListParams>): DeptListParams {
  return DeptSearchSchema.parse(params);
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasDeptFilters(params: Partial<DeptListParams>) {
  return Boolean(params.deptCategory || params.deptName || params.status);
}
