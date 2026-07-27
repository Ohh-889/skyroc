import { parseQuery, stringifyQuery } from '@skyroc/utils';
import { createRouter } from '@tanstack/react-router';

import { globalConfig } from '@/config';
import { queryClient } from '@/service/queryClient';

import { setRouter } from './router-ref';
import { routeTree } from './routeTree.gen';

/**
 * - 路由配置
 * - 使用的是 TanStack Router 的 约定式路由配置方法 无需手动配置路由
 * - 路由配置文件为 src/features/router/routeTree.gen.ts
 * - 路由约定式 [详情见](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts)
 * - https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
 * - https://tanstack.com/router/latest/docs/framework/react/routing/file-naming-conventions
 */
export const router = createRouter({
  context: {
    initAuth: () => Promise.resolve(null),
    clearAuth: () => {},
    getHomeRoute: () => globalConfig.defaultHome,
    homeRoute: globalConfig.defaultHome,
    isAuthInitialized: false,
    isLoggedIn: false,
    queryClient,
    userInfo: undefined
  },
  defaultPreload: 'intent',
  stringifySearch: stringifyQuery,
  parseSearch: parseQuery,
  defaultPreloadStaleTime: 0,
  defaultPendingMs: 10,
  defaultPendingMinMs: 1000,
  defaultStructuralSharing: true,
  notFoundMode: 'root',
  routeTree,
  scrollRestoration: true
});

export type RouterConfig = typeof router;

setRouter(router);

declare module '@tanstack/react-router' {
  interface Register {
    router: RouterConfig;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface StaticDataRouteOption extends Router.Meta {}
}
