import { request } from '../../request';

import type { DeptTreeNode, UserId, UserListItem, UserListPage, UserListParams } from './types';
import { SYSTEM_USER_URLS } from './urls';

export function fetchUserList(params: UserListParams) {
  return request<UserListPage>({
    method: 'get',
    params,
    url: SYSTEM_USER_URLS.USER_LIST
  });
}

export function fetchDeptTree() {
  return request<DeptTreeNode[]>({
    method: 'get',
    url: SYSTEM_USER_URLS.DEPT_TREE
  });
}

export function fetchUsersByDept(deptId: UserId) {
  return request<UserListItem[]>({
    method: 'get',
    url: SYSTEM_USER_URLS.LIST_BY_DEPT(deptId)
  });
}
