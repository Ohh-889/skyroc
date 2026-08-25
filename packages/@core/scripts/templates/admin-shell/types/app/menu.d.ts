// oxlint-disable unicorn/require-module-specifiers
/** The menu namespace */
declare global {
  namespace Menu {
    interface CommonMenu {
      /** The menu children */
      children?: CommonMenu[];
      /** The menu extra */
      extra?: React.ReactNode;
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey | null;
      /** The menu icon */
      icon?: React.ReactElement;
      /**
       * The menu key
       *
       * Equal to the route key
       */
      key: string;
      /** The menu label */
      label: React.ReactNode;
      /**
       * Menu order for sorting (using hyphen to avoid React DOM warning)
       *
       * @default 0
       */
      order?: number | null;
      /** The tooltip title */
      title?: string | null;
      /**
       * Menu type
       *
       * @default 'item'
       */
      type?: string;
    }

    interface QuickReferenceMenu extends Api.Route.BackendRoute {
      /** 菜单深度层级，从 0 开始 */
      depth?: number;

      /** 菜单的 key */
      key: string;

      /** 父级菜单的 key 列表 */
      parentKeys?: string[];
    }

    type QuickReferenceMenuMap = Map<Router.RoutePath, QuickReferenceMenu>;

    type QuickReferenceMenus = Map<string, QuickReferenceMenuMap>;

    type Menus = Map<Router.MenuCategoryKey, CommonMenu[]>;
  }
}

export {};
