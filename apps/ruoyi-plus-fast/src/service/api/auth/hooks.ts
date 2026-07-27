import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { fetchGetUserInfo, fetchLogin } from './api';
import { AUTH_MUTATION_KEYS, AUTH_QUERY_KEYS } from './keys';

export function queryUserInfoOptions() {
  return queryOptions({
    gcTime: Infinity,
    queryFn: fetchGetUserInfo,
    queryKey: AUTH_QUERY_KEYS.USER_INFO,
    retry: false,
    staleTime: Infinity
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (params: Api.Auth.LoginParams) => fetchLogin(params),
    mutationKey: AUTH_MUTATION_KEYS.LOGIN,
    retry: false
  });
}

export function useUserInfoQuery() {
  const query = queryUserInfoOptions();

  return useQuery(query);
}
