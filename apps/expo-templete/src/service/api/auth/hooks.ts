import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { fetchGetUserInfo, fetchLogin } from './api';
import { AUTH_MUTATION_KEYS, AUTH_QUERY_KEYS } from './keys';

export function queryUserInfoOptions() {
  return queryOptions({
    gcTime: Infinity,
    queryFn: ({ signal }) => fetchGetUserInfo(signal),
    queryKey: AUTH_QUERY_KEYS.USER_INFO,
    retry: false,
    staleTime: Infinity
  });
}

/**
 * 登录。
 *
 * 不在这里写存储和跳转：拿到凭据后调用方自己 `signIn`，页面才知道要不要先弹协议、先埋点。
 * 失败的提示由请求层统一弹（见 `service/adapter`），这里不用再接 onError。
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: (params: Api.Auth.LoginParams) => fetchLogin(params),
    mutationKey: AUTH_MUTATION_KEYS.LOGIN,
    // 登录是非幂等操作，失败了必须由用户自己决定要不要再来一次
    retry: false
  });
}

/** 当前登录用户信息。登出时 `queryClient.clear()` 会把它一起清掉 */
export function useUserInfoQuery() {
  const query = queryUserInfoOptions();

  return useQuery(query);
}
