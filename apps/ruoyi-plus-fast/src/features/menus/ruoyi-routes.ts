/**
 * 把 RuoYi 的 RouterVo 树翻成布局层认识的动态路由。
 *
 * 这一层存在的原因：RouterVo 是 Vue Router 的序列化格式，不是中立的菜单契约。component / redirect / alwaysShow / ParentView 这些都是 Vue
 * 端的实现细节，而这个壳的路由树是 `routeTree.gen.ts` 编译期生成的，后端的 component 从头到尾没人读——它在这里的角色只是对 一棵已存在的路由树做过滤和装饰。所以翻译写在前端，后端保持 RuoYi
 * 契约不动。
 *
 * 纯函数，不碰 IO，和后端 `menu/tree.py` 是对称的：那边把菜单行翻成 RouterVo，这边翻回来。
 */

import type { RuoYiRouter } from '@/service/api/route';

/** 后端 `component_info` 用它标记 iframe 内嵌页，见 menu/constants.py。 */
const INNER_LINK_COMPONENT = 'InnerLink';

/** 和 `defaultHome` 同源，避免首页路径在 env 和这里各写一份。 */
const HOME_ROUTE_PATH = import.meta.env.VITE_ROUTE_HOME;

/**
 * 一级菜单在后端被包了一层壳：外层 path 是 '/'、不带 meta，真正的页面在唯一的子路由上。
 *
 * 那层壳是给 Vue 端套布局用的，这里的布局由 `(admin)/layout.tsx` 提供，留着它只会多出一个 没有标题的菜单节点。
 */
function isMenuFrame(router: RuoYiRouter) {
  return router.path === '/' && !router.meta && router.children?.length === 1;
}

/**
 * RuoYi 的子路由 path 是相对父级的一段（`/system` 下面挂 `user`），而 `availableRoutePaths` 里存的是 TanStack 的
 * fullPath。不拼绝对路径的话每条子菜单都对不上，整棵树会被过滤光。
 */
function joinPath(parentPath: string, path: string) {
  if (path.startsWith('/')) return path;

  if (!path) return parentPath;

  return parentPath === '/' ? `/${path}` : `${parentPath}/${path}`;
}

/** QueryParam 是后台手填的 JSON 字符串。填坏了只让这一条菜单不带参数，不该把整棵菜单树炸掉。 */
function toRouteQuery(query?: string) {
  if (!query) return null;

  try {
    const parsed = JSON.parse(query) as Record<string, unknown>;

    return Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
  } catch {
    return null;
  }
}

function toRoutePayloads(routers: RuoYiRouter[], parentPath: string): Api.Route.BackendRoutePayload[] {
  // 后端按 (parent_id, order_num, id) 排好序才下发，RouterVo 不带 order_num，同级下标就是排序。
  return routers.flatMap((router, index) => toRoutePayload(router, parentPath, index));
}

function toRoutePayload(router: RuoYiRouter, parentPath: string, index: number): Api.Route.BackendRoutePayload[] {
  const path = joinPath(parentPath, router.path);

  if (isMenuFrame(router)) {
    return toRoutePayloads(router.children ?? [], path);
  }

  const { meta } = router;
  const link = meta?.link ?? null;
  const isInnerLink = router.component === INNER_LINK_COMPONENT;
  const children = router.children?.length ? toRoutePayloads(router.children, path) : null;

  return [
    {
      children,
      handle: {
        activeMenu: meta?.activeMenu ?? null,
        hideInMenu: router.hidden ?? null,
        href: isInnerLink ? null : link,
        icon: meta?.icon ?? null,
        // noCache 的语义是反的，这里翻回正的。没下发就交给下游默认值，不猜。
        keepAlive: meta?.noCache === undefined ? null : !meta.noCache,
        order: index,
        query: toRouteQuery(router.query),
        // 菜单名是后台配的裸串，没有对应词条，渲染时由 I18nLabel 回落到 title。
        title: meta?.title ?? null,
        url: isInnerLink ? link : null
      },
      // name 是 path 首字母大写加菜单 id，后端保证唯一，直接当运行时 id 用，不用再拆 id。
      name: router.name,
      path
    }
  ];
}

/**
 * 只活在前端路由树里、RuoYi 菜单表从来没有的页面。
 *
 * 首页是 Vue 端写死在前端路由上的，后端只管权限菜单；三个联调用的测试页同理，它们是这个壳自带 的调试入口，不该为了能访问就去后台建菜单。
 *
 * 但动态模式下「后端菜单」同时是权限白名单：`hasAuthorizedRoutePath` 只认 quickReferenceMenus 里的路径，不在里面的页面会被守卫打到 /403（首页还会让 `initHomeTab`
 * 拿不到菜单信息，返回 null 之后整条标签栏渲染成空）。所以这几条由前端在这一层补，后端契约不用动。
 *
 * 字段和各页面自己的 staticData 对齐，静态/动态两种模式下菜单表现一致；order 沿用静态模式的相 对顺序，后端顶层菜单的 order 从 0 开始排，首页取负数排在最前，测试页取大数排在最后。
 */
const FRONTEND_ROUTE_PAYLOADS: Api.Route.BackendRoutePayload[] = [
  {
    handle: {
      i18nKey: 'route.home',
      icon: 'mdi:monitor-dashboard',
      order: -1,
      title: '首页'
    },
    name: 'Home',
    path: HOME_ROUTE_PATH
  },
  {
    handle: {
      icon: 'mdi:connection',
      order: 20,
      title: 'WebSocket 测试'
    },
    name: 'WebsocketTest',
    path: '/websocket-test'
  },
  {
    handle: {
      icon: 'mdi:broadcast',
      order: 21,
      title: 'SSE 测试'
    },
    name: 'SseTest',
    path: '/sse-test'
  },
  {
    handle: {
      icon: 'mdi:text-box-search-outline',
      order: 22,
      title: '流式输出测试'
    },
    name: 'StreamTest',
    path: '/stream-test'
  }
];

/** 后台真配了同路径的菜单就以后台那条为准，否则菜单里会出现两个一样的节点。 */
function collectPaths(routes: Api.Route.BackendRoutePayload[], paths: Set<string>) {
  for (const route of routes) {
    paths.add(route.path);

    if (route.children?.length) collectPaths(route.children, paths);
  }

  return paths;
}

export function toBackendRouteResponse(routers: RuoYiRouter[]): Api.Route.BackendRouteResponse {
  const routes = toRoutePayloads(routers, '');
  const backendPaths = collectPaths(routes, new Set<string>());
  const frontendRoutes = FRONTEND_ROUTE_PAYLOADS.filter(route => !backendPaths.has(route.path));

  return {
    home: HOME_ROUTE_PATH,
    routes: [...frontendRoutes, ...routes]
  };
}
