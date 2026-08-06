import { queryOptions } from '@tanstack/react-query';

import { queryClient } from '@/service/queryClient';

import { SYSTEM_USER_QUERY_KEYS } from '../system-user/keys';

import { fetchGetBackendRoutes } from './api';
import { ROUTE_QUERY_KEYS } from './keys';

export function queryMenusOptions() {
  const enabled = Boolean(queryClient.getQueryData<Api.Auth.UserInfo>(SYSTEM_USER_QUERY_KEYS.USER_INFO));
  const isDev = import.meta.env.DEV;

  return queryOptions({
    enabled,
    gcTime: isDev ? 1000 * 60 * 5 : Infinity,
    queryFn: fetchGetBackendRoutes,
    queryKey: ROUTE_QUERY_KEYS.USER_ROUTES,
    staleTime: isDev ? 1000 * 10 : Infinity
  });
}
