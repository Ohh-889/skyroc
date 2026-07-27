// oxlint-disable unicorn/require-module-specifiers
declare global {
  namespace Router {
    interface RouteIdRegistry extends Record<keyof import('@/features/router/routeTree.gen').FileRoutesById, true> {}

    interface RoutePathRegistry extends Record<keyof import('@/features/router/routeTree.gen').FileRoutesByTo, true> {}

    interface MenuExtraRegistry extends Record<import('@/features/menus/extras').ExtraKey, true> {}

    interface MenuCategoryRegistry extends Record<import('@/features/menus/menu-category').MenuCategoryKey, true> {}

    interface RouterContext {
      getHomeRoute: () => RoutePath;
      homeRoute: RoutePath;
    }
  }
}

export {};
