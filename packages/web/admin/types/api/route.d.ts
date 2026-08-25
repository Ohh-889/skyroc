// oxlint-disable unicorn/require-module-specifiers
/**
 * 命名空间 Api.Route
 *
 * 后端 API 模块：路由模块
 */
declare global {
  namespace Api.Route {
    /** 后端返回的完整动态路由结构。 */
    interface BackendRouteResponse {
      /** 用户首页路由，后端原始响应是字符串，进入布局前再适配成 Router.RoutePath。 */
      home?: string | null;
      /** 用户可访问的后端路由树。 */
      routes: BackendRoutePayload[];
    }

    /** 后端动态路由节点的原始响应。 */
    interface BackendRoutePayload {
      /** 子路由树。 */
      children?: BackendRoutePayload[] | null;
      /** Vue/React 后端菜单常见的 meta/handle 承载字段。 */
      handle?: BackendRouteHandle | null;
      /** 后端菜单 ID。没有时使用 name 或 path 作为运行时 id。 */
      id?: number | string | null;
      /** 顶层菜单分类 key。 */
      layout?: Router.MenuCategoryKey | null;
      /** 兼容常见后端菜单模型中的 meta 字段。 */
      meta?: BackendRouteHandle | null;
      /** 后端路由名。 */
      name?: string | null;
      /** 父级菜单 ID。 */
      parentId?: number | string | null;
      /** 后端路由路径。 */
      path: string;
      /** 后端重定向字段，布局菜单不会直接消费。 */
      redirect?: string | null;
    }

    /** 后端动态路由默认携带的 URL search 参数。 */
    interface BackendRouteQuery {
      /** 参数 Key。 */
      key: string;
      /** 参数 Value。 */
      value: string;
    }

    /** 后端动态路由节点的 meta/handle 字段。 */
    interface BackendRouteHandle {
      /** 隐藏页需要激活的菜单路径。 */
      activeMenu?: string | null;
      /** 标准菜单 badge。 */
      badge?: Router.MenuBadge | null;
      /** 是否常量路由。 */
      constant?: boolean | null;
      /** 自定义菜单 extra key。 */
      extra?: Router.Extra | null;
      /** 固定页签序号。 */
      fixedIndexInTab?: number | null;
      /** 是否在菜单中隐藏。 */
      hideInMenu?: boolean | null;
      /** 外链地址。 */
      href?: string | null;
      /** 国际化 key。 */
      i18nKey?: I18n.I18nKey | null;
      /** Iconify 图标名。 */
      icon?: string | null;
      /** 是否缓存页面。 */
      keepAlive?: boolean | null;
      /** 本地图标名。 */
      localIcon?: string | null;
      /** 是否允许同一路由多页签。 */
      multiTab?: boolean | null;
      /** 菜单排序。 */
      order?: number | null;
      /** 点击菜单进入页面时默认携带的 search 参数。 */
      query?: BackendRouteQuery[] | null;
      /** 允许访问该路由的角色。 */
      roles?: string[] | null;
      /** 菜单标题。 */
      title?: string | null;
      /** 菜单类型。 */
      type?: Router.MenuType | null;
      /** Iframe 或外部页面地址。 */
      url?: string | null;
    }

    /** 布局运行时消费的动态路由节点。 */
    interface BackendRoute extends Router.Meta {
      children?: BackendRoute[] | null;

      id: string;

      layout?: Router.MenuCategoryKey | null;

      parentId?: string | null;

      path: Router.RoutePath;

      query?: BackendRouteQuery[] | null;
    }
  }
}

export {};
