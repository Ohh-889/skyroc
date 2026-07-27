import { request } from '../../request';

import { ROUTE_URLS } from './urls';

export function fetchGetBackendRoutes() {
  return request<Api.Route.BackendRouteResponse>({ url: ROUTE_URLS.GET_USER_ROUTES });
}
