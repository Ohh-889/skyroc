/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
  /** The router history mode */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  interface AppImportMetaEnv {
    /** The description of the application */
    readonly VITE_APP_DESC: string;
    /** The title of the application */
    readonly VITE_APP_TITLE: string;
    /**
     * The auth route mode
     *
     * - Static: the auth routes is generated in front-end
     * - Dynamic: the auth routes is generated in back-end
     */
    readonly VITE_AUTH_ROUTE_MODE: 'dynamic' | 'static';
    /** Whether to automatically detect updates after configuring application packaging */
    readonly VITE_AUTOMATICALLY_DETECT_UPDATE?: Common.YesOrNo;
    /** The base url of the application */
    readonly VITE_BASE_URL: string;

    /**
     * Whether to enable the http proxy
     *
     * Only valid in the development environment
     */
    readonly VITE_HTTP_PROXY?: Common.YesOrNo;
    /**
     * The prefix of the local icon
     *
     * This prefix is start with the icon prefix
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'icon-local';
    /** The prefix of the iconify icon */
    readonly VITE_ICON_PREFIX: 'icon';
    /**
     * Iconify api provider url
     *
     * If the project is deployed in intranet, you can set the api provider url to the local iconify server
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string;
    /**
     * Default menu icon if menu icon is not set
     *
     * Iconify icon name
     */
    readonly VITE_MENU_ICON: string;
    /**
     * Other backend service base url
     *
     * The value is a json
     */
    readonly VITE_OTHER_SERVICE_BASE_URL: string;
    /** Show proxy url log in terminal */
    readonly VITE_PROXY_LOG?: Common.YesOrNo;
    /**
     * The home route key
     *
     * It only has effect when the auth route mode is static, if the route mode is dynamic, the home route key is
     * defined in the back-end
     */
    readonly VITE_ROUTE_HOME: Router.RoutePath;
    /** The router history mode */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode;
    /** Backend service base url */
    readonly VITE_SERVICE_BASE_URL: string;
    /**
     * Token expired codes of backend service
     *
     * When the code is received, it will refresh the token and resend the request
     *
     * Use "," to separate multiple codes
     */
    readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string;
    /**
     * Logout codes of backend service
     *
     * When the code is received, the user will be logged out and redirected to login page
     *
     * Use "," to separate multiple codes
     */
    readonly VITE_SERVICE_LOGOUT_CODES: string;
    /**
     * Modal logout codes of backend service
     *
     * When the code is received, the user will be logged out by displaying a modal
     *
     * Use "," to separate multiple codes
     */
    readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string;
    /**
     * Success code of backend service
     *
     * When the code is received, the request is successful
     */
    readonly VITE_SERVICE_SUCCESS_CODE: string;
    /** Whether to build with sourcemap */
    readonly VITE_SOURCE_MAP?: Common.YesOrNo;
    /** When the route mode is static, the defined super role */
    readonly VITE_STATIC_SUPER_ROLE: string;
    /** Used to differentiate storage across different domains */
    readonly VITE_STORAGE_PREFIX?: string;
  }

  type ImportMeta = AppImportMetaEnv;
}

interface ImportMetaEnv extends Env.AppImportMetaEnv {}

declare module 'virtual:svg-icons-register';
