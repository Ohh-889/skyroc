import { request } from '../../request';

import type { RuoYiRouter } from './types';
import { ROUTE_URLS } from './urls';

export function fetchGetBackendRoutes() {
  return request<RuoYiRouter[]>({ url: ROUTE_URLS.GET_USER_ROUTES });
}
