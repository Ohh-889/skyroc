import { request } from '../../request';

import type { OnlineSessionListParams, OnlineSessionPage } from './types';
import { MONITOR_ONLINE_URLS } from './urls';

export function fetchOnlineSessionList(params: OnlineSessionListParams) {
  return request<OnlineSessionPage>({ method: 'get', params, url: MONITOR_ONLINE_URLS.LIST });
}

export function forceLogoutSession(tokenId: string) {
  return request<null>({ method: 'delete', url: MONITOR_ONLINE_URLS.FORCE_LOGOUT(tokenId) });
}
