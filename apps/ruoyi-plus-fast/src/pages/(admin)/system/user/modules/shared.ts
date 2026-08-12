import type { TableQueryHookOptions } from '@skyroc/web-ui-compose';
import { z } from 'zod';

import {
  optionalSearchEnum,
  optionalSearchText,
  resolveSearchPagination,
  searchPaginationShape
} from '@/features/table/search-params';
import { useUserListQuery } from '@/service/api/system-user';
import type { UserExportParams, UserListPage, UserListParams } from '@/service/api/system-user';

export type UserSearchField = 'nickname' | 'phone' | 'username';

/**
 * 表格参数。
 *
 * 关键词和它匹配的字段是查询表单自己的表达方式，发请求前才摊开成接口的 userName / nickName / phonenumber。 URL 上存的也是这一对，比三个字段轮流出现更好读。
 */
export interface UserTableParams extends UserListParams {
  /** 尚未转换为接口字段的查询关键词。 */
  keyword?: string;
  /** 关键词匹配的用户字段。 */
  searchField?: UserSearchField;
}

/** URL 查询串的契约，同时也是发请求前的清洗规则。默认值不写在这里，见 getUserSearchInitialParams。 */
export const UserSearchSchema = z.object({
  ...searchPaginationShape,
  deptId: optionalSearchText,
  keyword: optionalSearchText,
  searchField: optionalSearchEnum(['nickname', 'phone', 'username']),
  status: optionalSearchEnum(['0', '1'])
});

export type UserSearchQuery = z.infer<typeof UserSearchSchema>;

/** 表格首次加载、以及点重置时回到的参数。URL 上带了参数时会覆盖掉这里的值。 */
export function getUserSearchInitialParams(pageSize: number): UserTableParams {
  return {
    // 这些 undefined 不是占位：reset 用 form.setFieldsValue 清表单，而它是合并语义，
    // 对象里没有的 key 会被原样留在输入框里。新增筛选项时必须同步加进来。
    current: 1,
    deptId: undefined,
    keyword: undefined,
    searchField: 'username',
    size: pageSize,
    status: undefined
  };
}

/** 表格参数写回 URL。 */
export function toUserSearchQuery(params: Partial<UserTableParams>): UserSearchQuery {
  return UserSearchSchema.parse(params);
}

/** 发请求前的参数整形。从 URL 回填的参数全是字符串，统一过一遍 schema 再发出去。 */
export function normalizeUserSearchParams(params: Partial<UserTableParams>): UserTableParams {
  const query = UserSearchSchema.parse(params);

  return { ...query, ...resolveSearchPagination(query) };
}

/** 关键词摊开成接口认识的三个字段。三个都显式赋值，避免上一次的关键词留在别的字段上。 */
export function toUserListParams(params: UserTableParams): UserListParams {
  const { keyword, searchField, ...listParams } = params;
  const result: UserListParams = { ...listParams, nickName: undefined, phonenumber: undefined, userName: undefined };

  if (keyword && searchField === 'nickname') result.nickName = keyword;
  if (keyword && searchField === 'phone') result.phonenumber = keyword;
  if (keyword && searchField === 'username') result.userName = keyword;

  return result;
}

/** 导出的是筛选命中的全部数据，分页参数带上去也不生效。 */
export function toUserExportParams(params: UserTableParams): UserExportParams {
  const { current: _current, size: _size, ...filters } = toUserListParams(params);

  return filters;
}

/** 是否存在生效中的筛选条件，用来提示用户当前列表不是全量。 */
export function hasUserFilters(params: Partial<UserTableParams>) {
  return Boolean(params.deptId || params.keyword || params.status);
}

/** 表格查询。参数在这里才摊开成接口字段，表格那侧始终看到 keyword / searchField。 */
export function useUserTableQuery<Data = UserListPage>(
  params: UserTableParams,
  options?: TableQueryHookOptions<UserListPage, Data>
) {
  return useUserListQuery(toUserListParams(params), options);
}
