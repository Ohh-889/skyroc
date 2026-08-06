import { request } from '../../request';

import type { DeptId, DeptItem, DeptListParams, DeptSavePayload, DeptUpdatePayload } from './types';
import { SYSTEM_DEPT_URLS } from './urls';

export function fetchDeptList(params: DeptListParams = {}) {
  return request<DeptItem[]>({
    method: 'get',
    params,
    url: SYSTEM_DEPT_URLS.LIST
  });
}

export function fetchDeptDetail(deptId: DeptId) {
  return request<DeptItem>({
    method: 'get',
    url: SYSTEM_DEPT_URLS.DETAIL(deptId)
  });
}

export function fetchDeptListExcludingSubtree(deptId: DeptId) {
  return request<DeptItem[]>({
    method: 'get',
    url: SYSTEM_DEPT_URLS.EXCLUDE_SUBTREE(deptId)
  });
}

export function createDept(data: DeptSavePayload) {
  return request<DeptItem>({
    data,
    method: 'post',
    url: SYSTEM_DEPT_URLS.CREATE
  });
}

export function updateDept(data: DeptUpdatePayload) {
  return request<DeptItem>({
    data,
    method: 'put',
    url: SYSTEM_DEPT_URLS.UPDATE
  });
}

export function deleteDept(deptId: DeptId) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_DEPT_URLS.DELETE(deptId)
  });
}
