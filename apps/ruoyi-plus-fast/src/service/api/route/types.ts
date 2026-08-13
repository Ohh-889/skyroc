/** RuoYi RouterVo 的 meta。后端对空字段整条不发，所以这里每个键都是可选的。 */
export interface RuoYiRouterMeta {
  /** 隐藏页要高亮的菜单路径，后端取自 sys_menu.remark，只有写成路径的才下发。 */
  activeMenu?: string;
  /** Iconify 图标名。 */
  icon?: string;
  /** 外链地址，仅当菜单 path 本身是 http(s) 地址时才下发。 */
  link?: string;
  /** 语义是反的：true 表示不缓存。 */
  noCache?: boolean;
  /** 菜单名，取自 sys_menu.menu_name，是后台手配的裸串，没有 i18n 词条。 */
  title?: string;
}

/** RuoYi `/system/menu/getRouters` 返回的一条路由。 */
export interface RuoYiRouter {
  /** 目录只有一个子节点时也展开显示，Vue 端的渲染开关，这个壳没有对应概念。 */
  alwaysShow?: boolean;
  children?: RuoYiRouter[];
  /** Vue 端的组件路径或 Layout/ParentView/InnerLink 标记，这里只用来识别内链。 */
  component?: string;
  hidden?: boolean;
  meta?: RuoYiRouterMeta;
  /** path 首字母大写加菜单 id，后端保证全局唯一。 */
  name: string;
  /** 顶级是绝对路径，子级是相对父级的一段。 */
  path: string;
  /** 菜单默认携带的 search 参数，JSON 字符串。 */
  query?: string;
  /** Vue Router 专用，固定为 'noRedirect'。 */
  redirect?: string;
}
