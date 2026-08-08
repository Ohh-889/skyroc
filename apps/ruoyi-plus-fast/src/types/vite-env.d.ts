/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
  /** The router history mode */
  type RouterHistoryMode = 'hash' | 'history' | 'memory';

  interface AppImportMetaEnv {
    /**
     * The header carrying the encrypted AES key
     *
     * Must match the backend `API_CRYPTO_HEADER`
     */
    readonly VITE_API_CRYPTO_HEADER?: string;
    /**
     * The RSA public key (PEM) used to encrypt request bodies
     *
     * Line breaks are written as literal `\n`. When it is empty, requests marked with `encrypt: true` fail instead of
     * falling back to plaintext
     */
    readonly VITE_API_CRYPTO_PUBLIC_KEY?: string;
    /** The description of the application */
    readonly VITE_APP_DESC: string;
    /** The title of the application */
    readonly VITE_APP_TITLE: string;
    /** Whether image captcha is enabled on the login page */
    readonly VITE_AUTH_CAPTCHA_ENABLED?: Common.YesOrNo;
    /**
     * The client id sent with every login request
     *
     * Must match a row of the backend `sys_client` table. The backend rejects the login when the client is unknown, has
     * not opened the `password` grant type, or is disabled
     */
    readonly VITE_AUTH_CLIENT_ID: string;
    /** Feishu OAuth authorization URL */
    readonly VITE_AUTH_FEISHU_URL?: string;
    /**
     * The auth route mode
     *
     * - Static: the auth routes is generated in front-end
     * - Dynamic: the auth routes is generated in back-end
     */
    readonly VITE_AUTH_ROUTE_MODE: 'dynamic' | 'static';
    /** WeChat OAuth authorization URL */
    readonly VITE_AUTH_WECHAT_URL?: string;
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
     * Connection ready code of the realtime stream (WebSocket / SSE)
     *
     * When the code is received, the connection is authenticated and usable
     */
    readonly VITE_SERVICE_CONNECTED_CODE: string;
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
    /** Whether to connect to the backend SSE stream after login */
    readonly VITE_SSE_ENABLED?: Common.YesOrNo;
    /** Backend SSE endpoint, for example http://127.0.0.1:8000/resource/sse */
    readonly VITE_SSE_URL?: string;
    /** When the route mode is static, the defined super role */
    readonly VITE_STATIC_SUPER_ROLE: string;
    /** Used to differentiate storage across different domains */
    readonly VITE_STORAGE_PREFIX?: string;
    /** Whether to connect to the backend WebSocket after login */
    readonly VITE_WEBSOCKET_ENABLED?: Common.YesOrNo;
    /** Backend WebSocket endpoint, for example ws://127.0.0.1:8000/resource/websocket */
    readonly VITE_WEBSOCKET_URL?: string;
  }

  type ImportMeta = AppImportMetaEnv;
}

interface ImportMetaEnv extends Env.AppImportMetaEnv {}

declare module 'virtual:svg-icons-register';
