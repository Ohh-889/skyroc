// oxlint-disable unicorn/require-module-specifiers
/** The router namespace */
declare global {
  namespace Router {
    type QueryClient = import('@tanstack/react-query').QueryClient;

    interface RouteIdRegistry {}

    type RouteId = keyof RouteIdRegistry extends never ? string : Extract<keyof RouteIdRegistry, string>;

    interface RoutePathRegistry {}

    type RoutePath = keyof RoutePathRegistry extends never ? string : Extract<keyof RoutePathRegistry, string>;

    type Extra = keyof MenuExtraRegistry extends never ? string : Extract<keyof MenuExtraRegistry, string>;

    interface MenuExtraRegistry {}

    type MenuCategoryKey = keyof MenuCategoryRegistry extends never
      ? string
      : Extract<keyof MenuCategoryRegistry, string>;

    interface MenuCategoryRegistry {}

    type MenuBadgeType = 'dot' | 'normal';

    type MenuBadgeValue = number | string | null;

    type MenuBadgeVariant = 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';

    type MenuType = 'divider' | 'group' | 'item';

    interface MenuBadge {
      /** Whether zero should still be rendered as badge content. */
      showZero?: boolean;
      /** Whether to render a dot badge or content badge. */
      type?: MenuBadgeType;
      /** Static badge content used when no dynamic value is provided. */
      value?: MenuBadgeValue;
      /** Key used to read dynamic badge content from the layout badge value map. */
      valueKey?: string;
      /** Visual status variant for the badge. */
      variant?: MenuBadgeVariant;
    }

    interface Meta {
      /** External link opened when the route is selected */
      href?: string | null;

      /**
       * I18n key of the route
       *
       * It's used in i18n, if it is set, the title will be ignored
       */
      i18nKey?: I18n.I18nKey | null;

      /** Whether to cache the route */
      keepAlive?: boolean | null;

      /**
       * Menu configuration of the route
       *
       * It controls how the route is displayed in the menu
       */
      menu?: {
        /**
         * The menu key will be activated when entering the route
         *
         * It is usually used for detail pages or hidden routes
         *
         * Active strategy configuration
         *
         * It defines which menu should be activated when entering the route
         */
        activeMenu?: RoutePath | null;

        /**
         * Standard menu badge.
         *
         * It is used for common menu status like dot, count, new, and hot.
         */
        badge?: MenuBadge | null;

        /**
         * Custom menu extra component key.
         *
         * It is used for app-provided menu extra components that do not fit the standard badge model.
         */
        extra?: Extra | null;
        /**
         * Whether to hide the route in the menu
         *
         * If true, the route will not be rendered in the menu tree
         */
        hide?: boolean | null;

        /**
         * Iconify icon
         *
         * It can be used in the menu or breadcrumb
         */
        icon?: string | null;

        /**
         * Local icon
         *
         * In "src/assets/svg-icon", if it is set, the icon will be ignored
         */
        localIcon?: string | null;

        /**
         * Meta data of the menu
         *
         * It can be used to add meta data to the menu
         */
        meta?: { key: string; value: string }[] | null;

        /**
         * The menu order
         *
         * Smaller value means higher priority
         */
        order?: number | null;

        /**
         * Menu type
         *
         * @default 'item'
         */
        type?: MenuType | null;
      };

      /** Required permissions to access the route */
      permissions?: string[] | null;

      /** Default search params carried when this route is opened from a menu. */
      query?: Api.Route.BackendRouteQuery[] | null;

      /**
       * Whether the route is required
       *
       * It can be used in permission or feature checks
       */
      requiresAuth?: boolean;

      /**
       * Tabs behavior configuration
       *
       * It controls how the route behaves in the tabs system
       */
      tab?: {
        /** If set, the route will be fixed in tabs, and the value is the order of fixed tabs */
        fixedIndex?: number | null;

        /**
         * Whether to allow multiple tabs for the same route
         *
         * By default, the same route path will use one tab, even with different query parameters
         */
        multi?: boolean | null;
      };

      /**
       * Title of the route
       *
       * It can be used in document title
       */
      title?: string | null;

      /** External page url rendered inside an iframe route */
      url?: string | null;
    }

    interface RouterContext {
      /**
       * Initialize authentication information
       *
       * @returns The user information
       */
      initAuth: () => Promise<Api.Auth.UserInfo | null>;
      /** Whether the authentication information has been initialized */
      isAuthInitialized: boolean;
      /** Whether the user is logged in */
      isLoggedIn: boolean;
      /** Logout user and clear authentication information */
      logout: () => Promise<void>;
      /** Query client */
      queryClient: QueryClient;
      /** User information */
      userInfo?: Api.Auth.UserInfo;
    }
  }
}

export {};
