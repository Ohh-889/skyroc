import { request } from '../../request';

import type { UserPasswordChangePayload, UserProfilePayload, UserProfileResponse } from './types';
import { SYSTEM_USER_PROFILE_URLS } from './urls';

export function fetchUserProfile() {
  return request<UserProfileResponse>({ method: 'get', url: SYSTEM_USER_PROFILE_URLS.DETAIL });
}

/** 回的是改完的那一份，昵称改完不用再打一次 GET */
export function updateUserProfile(data: UserProfilePayload) {
  return request<UserProfileResponse>({ data, method: 'put', url: SYSTEM_USER_PROFILE_URLS.UPDATE });
}

/** 旧密码对不上、新旧密码相同都会被后端拒掉 */
export function updateUserPassword(data: UserPasswordChangePayload) {
  return request<null>({ data, method: 'put', url: SYSTEM_USER_PROFILE_URLS.UPDATE_PASSWORD });
}
