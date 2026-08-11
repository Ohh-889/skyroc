import { request } from '../../request';

import { getToken } from '@/features/auth/use-auth';

import type {
  CurrentUserInfoResponse,
  DeptTreeNode,
  UserDetailResponse,
  UserExportParams,
  UserId,
  UserImportPayload,
  UserImportResponse,
  UserListItem,
  UserListPage,
  UserListParams,
  UserOptionParams,
  UserPasswordPayload,
  UserPostOption,
  UserRolePayload,
  UserSavePayload,
  UserStatusPayload,
  UserUpdatePayload
} from './types';
import { SYSTEM_USER_URLS } from './urls';

export async function fetchGetUserInfo() {
  if (!getToken()) {
    return null;
  }

  const data = await request<CurrentUserInfoResponse>({ url: SYSTEM_USER_URLS.GET_USER_INFO });

  return {
    buttons: data.permissions,
    nickname: data.user.nickName,
    roles: data.roles,
    userId: String(data.user.userId),
    userName: data.user.userName
  } satisfies Api.Auth.UserInfo;
}

export function fetchUserList(params: UserListParams) {
  return request<UserListPage>({
    method: 'get',
    params,
    url: SYSTEM_USER_URLS.USER_LIST
  });
}

export function exportUsers(params: UserExportParams) {
  return request<Blob, 'blob'>({
    method: 'post',
    params,
    responseType: 'blob',
    url: SYSTEM_USER_URLS.USER_EXPORT
  });
}

export function downloadUserImportTemplate() {
  return request<Blob, 'blob'>({
    method: 'post',
    responseType: 'blob',
    url: SYSTEM_USER_URLS.IMPORT_TEMPLATE
  });
}

/** 同 `uploadOssFile`：不显式声明 multipart，FormData 会被默认的 application/json 头转成 JSON。 */
export function importUsers(payload: UserImportPayload) {
  const data = new FormData();
  data.append('file', payload.file);
  data.append('updateSupport', String(payload.updateSupport));

  return request<UserImportResponse>({
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    url: SYSTEM_USER_URLS.IMPORT_DATA
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

export function fetchUserOptions(params: UserOptionParams = {}) {
  return request<UserListItem[]>({
    method: 'get',
    params: {
      deptId: params.deptId,
      userIds: params.userIds?.map(String).join(',')
    },
    url: SYSTEM_USER_URLS.OPTIONS
  });
}

export function fetchUserDetail(userId?: UserId) {
  return request<UserDetailResponse>({
    method: 'get',
    url: userId  ? SYSTEM_USER_URLS.DETAIL(userId): SYSTEM_USER_URLS.FORM_OPTIONS
  });
}

export function fetchUserAuthRole(userId: UserId) {
  return request<UserDetailResponse>({ method: 'get', url: SYSTEM_USER_URLS.AUTH_ROLE_DETAIL(userId) });
}

export function fetchUserPostOptions(deptId: UserId) {
  return request<UserPostOption[]>({ method: 'get', params: { deptId }, url: SYSTEM_USER_URLS.POST_OPTIONS });
}

export function createUser(data: UserSavePayload) {
  return request<UserListItem>({ data, method: 'post', url: SYSTEM_USER_URLS.CREATE });
}

export function updateUser(data: UserUpdatePayload) {
  return request<UserListItem>({ data, method: 'put', url: SYSTEM_USER_URLS.UPDATE });
}

export function deleteUsers(userIds: UserId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_USER_URLS.DELETE(userIds) });
}

export function updateUserStatus(data: UserStatusPayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_USER_URLS.CHANGE_STATUS });
}

export function resetUserPassword(data: UserPasswordPayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_USER_URLS.RESET_PASSWORD });
}

export function updateUserRoles(data: UserRolePayload) {
  return request<null>({
    method: 'put',
    params: { roleIds: data.roleIds.map(String).join(','), userId: data.userId },
    url: SYSTEM_USER_URLS.AUTH_ROLE
  });
}
