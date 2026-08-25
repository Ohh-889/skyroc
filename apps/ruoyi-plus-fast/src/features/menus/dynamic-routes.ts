import { createAdminDynamicRouteLoader } from '@shell/layouts';

import { routeTree } from '@/features/router/routeTree.gen';
import { queryMenusOptions } from '@/service/api/route/hooks';
import { queryClient } from '@/service/queryClient';

import { toBackendRouteResponse } from './ruoyi-routes';

export const loadAdminDynamicRoutes = createAdminDynamicRouteLoader({
  routeTree,
  loadBackendRoutes: async () => toBackendRouteResponse(await queryClient.ensureQueryData(queryMenusOptions()))
});
