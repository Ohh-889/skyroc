import { createAdminDynamicRouteLoader } from '@shell/layouts';

import { routeTree } from '@/features/router/routeTree.gen';
import { queryMenusOptions } from '@/service/api/route/hooks';
import { queryClient } from '@/service/queryClient';

export const loadAdminDynamicRoutes = createAdminDynamicRouteLoader({
  routeTree,
  loadBackendRoutes: () => queryClient.ensureQueryData(queryMenusOptions())
});
