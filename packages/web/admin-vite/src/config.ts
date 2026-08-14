import process from 'node:process';
import { resolve } from 'node:path';

import { defineConfig as defineViteConfig, loadEnv, mergeConfig } from 'vite';
import type { CSSOptions, ConfigEnv, UserConfig, UserConfigExport } from 'vite';

import { createAdminBuildOptions, createAdminScssPreprocessorOptions } from './build';
import type { CreateAdminBuildOptionsOptions } from './build';
import { setupAdminVitePlugins } from './plugins';
import type { SetupAdminVitePluginsConfig } from './plugins';
import { createAdminViteProxy, createAdminViteServiceConfig } from './proxy';
import type { AdminViteServiceConfig, AdminViteServiceEnv } from './proxy';
import { getBuildTime } from './time';
import type { GetBuildTimeOptions } from './time';
import type { MaybePluginConfig } from './types';

type AdminViteConfigValue<T, E extends AdminViteEnv> = T | ((context: AdminViteConfigContext<E>) => T);
type VitePreviewOptions = NonNullable<UserConfig['preview']>;
type ViteServerOptions = NonNullable<UserConfig['server']>;

export interface AdminViteEnv extends AdminViteServiceEnv {
  /** Application base url. */
  VITE_BASE_URL?: string;

  /** Whether the local development proxy is enabled. */
  VITE_HTTP_PROXY?: string;

  /** Whether proxy request logging is enabled. */
  VITE_PROXY_LOG?: string;
}

export interface AdminViteConfigContext<E extends AdminViteEnv = AdminViteEnv> {
  /** Build time string created for the current config load. */
  buildTime: string;

  /** Vite config env from defineConfig. */
  configEnv: ConfigEnv;

  /** Loaded Vite environment. */
  env: E;

  /** Whether Vite is running build. */
  isBuild: boolean;

  /** Whether Vite is running preview. */
  isPreview: boolean;

  /** Whether Vite is running dev server. */
  isServe: boolean;

  /** Application root directory. */
  root: string;
}

export interface AdminViteCssOptions<E extends AdminViteEnv = AdminViteEnv> {
  /** SCSS content injected before app styles. */
  additionalData?: AdminViteConfigValue<string, E>;
}

export interface AdminViteProxyOptions<E extends AdminViteEnv = AdminViteEnv> {
  /** Whether proxy creation is enabled. */
  enabled?: AdminViteConfigValue<boolean, E>;

  /** Whether proxy request logging is enabled. */
  enableLog?: AdminViteConfigValue<boolean, E>;

  /** Service config or service config factory used to create Vite proxy items. */
  serviceConfig?: AdminViteConfigValue<AdminViteServiceConfig, E>;
}

export interface AdminViteResolveOptions {
  /** Whether to dedupe React runtime entries. */
  dedupeReact?: boolean;

  /** Path used by the ~ alias. */
  rootAlias?: false | string;

  /** Path used by the @ alias. */
  srcAlias?: false | string;
}

export interface AdminViteServerOptions {
  /** Dev server host. */
  host?: ViteServerOptions['host'];

  /** Whether Vite opens the browser on startup. */
  open?: ViteServerOptions['open'];

  /** Dev server port. */
  port?: ViteServerOptions['port'];

  /** Files warmed up by Vite dev server. */
  warmupClientFiles?: string[];
}

export interface AdminVitePreviewOptions {
  /** Preview server port. */
  port?: VitePreviewOptions['port'];
}

export interface AdminViteApplicationOptions<E extends AdminViteEnv = AdminViteEnv> {
  /** Application base url. */
  base?: AdminViteConfigValue<string | undefined, E>;

  /** Build output options. */
  build?: MaybePluginConfig<CreateAdminBuildOptionsOptions>;

  /** Build time generation options. */
  buildTime?: MaybePluginConfig<GetBuildTimeOptions>;

  /** Global constant name used to inject build time. */
  buildTimeDefineName?: false | string;

  /** CSS preprocessor preset. */
  css?: false | AdminViteCssOptions<E>;

  /** Env files directory. */
  envDir?: string;

  /** Built-in plugin switches, options, and custom plugin insertion points. */
  plugins?: false | SetupAdminVitePluginsConfig;

  /** Preview server preset. */
  preview?: false | AdminVitePreviewOptions;

  /** Dev server proxy preset. */
  proxy?: false | AdminViteProxyOptions<E>;

  /** Resolve aliases and dedupe preset. */
  resolve?: false | AdminViteResolveOptions;

  /** Application root directory. */
  root?: string;

  /** Dev server preset. */
  server?: false | AdminViteServerOptions;
}

export interface AdminViteUserConfig<E extends AdminViteEnv = AdminViteEnv> {
  /** Skyroc admin application preset options. */
  application?: AdminViteApplicationOptions<E>;

  /** Raw Vite config merged after the admin preset. */
  vite?: UserConfig;
}

export type DefineAdminViteConfigFactory<E extends AdminViteEnv = AdminViteEnv> = (
  config?: ConfigEnv
) => AdminViteUserConfig<E> | Promise<AdminViteUserConfig<E>>;

export type DefineAdminViteConfig<E extends AdminViteEnv = AdminViteEnv> =
  | AdminViteUserConfig<E>
  | DefineAdminViteConfigFactory<E>;

const DEFAULT_REACT_DEDUPE = ['react', 'react-dom', 'react/jsx-dev-runtime', 'react/jsx-runtime'];

// 这几个库都把状态挂在模块作用域上（i18n 实例、React context、cssinjs 样式注册表、jotai store），
// 装出第二份就等于多一套互相看不见的全局状态。pnpm 只要 peer 解析分叉——比如 workspace 包
// 声明了 react 却漏了 react-dom，peer 就会落到另一个版本上——就会给 app 和包各装一份。
//
// 实测踩到的两个后果：
//   - react-i18next 双份：包里 initReactI18next 注册的实例，app 的 useTranslation() 读不到，
//     控制台报 NO_I18NEXT_INSTANCE，页面把 key 原样渲染出来；
//   - antd 双份：第二个实例拿不到 AntdProvider 的 DesignTokenContext，回退成 antd 默认主题，
//     自己往页面注入一整块 `.css-var-root{--ant-*}`，用它渲染的组件全是默认配色。
//
// 去重只是护栏，真正的根因要在各包的 package.json 里把 react/react-dom 声明齐。
const DEFAULT_SINGLETON_DEDUPE = [
  'i18next',
  'react-i18next',
  'antd',
  '@ant-design/cssinjs',
  '@ant-design/icons',
  'jotai',
  '@tanstack/react-query',
  '@tanstack/react-router'
];
const DEFAULT_WARMUP_CLIENT_FILES = ['./index.html', './src/{pages,components}/*'];

export function defineConfig<_E extends AdminViteEnv = AdminViteEnv>(): UserConfigExport;
export function defineConfig<E extends AdminViteEnv = AdminViteEnv>(
  userConfig: AdminViteUserConfig<E>
): UserConfigExport;
export function defineConfig<E extends AdminViteEnv = AdminViteEnv>(
  userConfig: DefineAdminViteConfigFactory<E>
): UserConfigExport;
export function defineConfig<E extends AdminViteEnv = AdminViteEnv>(
  userConfig?: DefineAdminViteConfig<E>
): UserConfigExport {
  return defineViteConfig(async configEnv => {
    const options = await resolveUserConfig(userConfig, configEnv);
    const application = options.application ?? {};
    const root = application.root ?? process.cwd();
    const env = loadEnv(configEnv.mode, application.envDir ?? root) as unknown as E;
    const buildTime = createBuildTime(application.buildTime);
    const context: AdminViteConfigContext<E> = {
      buildTime,
      configEnv,
      env,
      isBuild: configEnv.command === 'build',
      isPreview: Boolean(configEnv.isPreview),
      isServe: configEnv.command === 'serve',
      root
    };
    const adminConfig = createAdminApplicationConfig(application, context);

    return mergeConfig(adminConfig, options.vite ?? {});
  });
}

async function resolveUserConfig<E extends AdminViteEnv>(
  userConfig: DefineAdminViteConfig<E> | undefined,
  configEnv: ConfigEnv
) {
  if (typeof userConfig === 'function') {
    return (await userConfig(configEnv)) ?? {};
  }

  return userConfig ?? {};
}

function createAdminApplicationConfig<E extends AdminViteEnv>(
  application: AdminViteApplicationOptions<E>,
  context: AdminViteConfigContext<E>
) {
  const config: UserConfig = {
    base: resolveConfigValue(application.base, context) ?? context.env.VITE_BASE_URL ?? '/'
  };

  if (application.build !== false) {
    config.build = createAdminBuildOptions(resolvePluginOptions(application.build));
  }

  const css = createCssOptions(application.css, context);
  if (css) {
    config.css = css;
  }

  config.define = {
    __DEV__: JSON.stringify(context.isServe)
  };

  if (application.buildTimeDefineName !== false) {
    config.define = {
      ...config.define,
      [application.buildTimeDefineName ?? 'BUILD_TIME']: JSON.stringify(context.buildTime)
    };
  }

  if (application.plugins !== false) {
    config.plugins = setupAdminVitePlugins({
      buildTime: context.buildTime,
      plugins: application.plugins
    });
  }

  if (application.preview !== false) {
    config.preview = {
      port: 9725,
      ...application.preview
    };
  }

  if (application.resolve !== false) {
    config.resolve = createResolveOptions(application.resolve, context.root);
  }

  if (application.server !== false) {
    config.server = createServerOptions(application.server, application.proxy, context);
  }

  return config;
}

function createBuildTime(config: MaybePluginConfig<GetBuildTimeOptions> | undefined) {
  return getBuildTime(resolvePluginOptions(config));
}

function createCssOptions<E extends AdminViteEnv>(
  css: AdminViteApplicationOptions<E>['css'],
  context: AdminViteConfigContext<E>
): CSSOptions | undefined {
  if (css === false) return undefined;

  const additionalData = resolveConfigValue(css?.additionalData, context);
  if (!additionalData) return undefined;

  return {
    preprocessorOptions: createAdminScssPreprocessorOptions(additionalData)
  };
}

function createResolveOptions(resolveOptions: AdminViteResolveOptions | undefined, root: string): UserConfig['resolve'] {
  const { dedupeReact = true, rootAlias = '.', srcAlias = 'src' } = resolveOptions ?? {};
  const alias: Record<string, string> = {};

  if (srcAlias !== false) {
    alias['@'] = resolve(root, srcAlias);
  }

  if (rootAlias !== false) {
    alias['~'] = resolve(root, rootAlias);
  }

  return {
    alias,
    dedupe: [...(dedupeReact ? DEFAULT_REACT_DEDUPE : []), ...DEFAULT_SINGLETON_DEDUPE]
  };
}

function createServerOptions<E extends AdminViteEnv>(
  server: false | AdminViteServerOptions | undefined,
  proxy: false | AdminViteProxyOptions<E> | undefined,
  context: AdminViteConfigContext<E>
): UserConfig['server'] {
  const { host = '0.0.0.0', open = true, port = 9527, warmupClientFiles = DEFAULT_WARMUP_CLIENT_FILES } = server || {};
  const serverOptions: UserConfig['server'] = {
    host,
    open,
    port,
    warmup: {
      clientFiles: warmupClientFiles
    }
  };
  const proxyOptions = createProxyOptions(proxy, context);

  if (proxyOptions) {
    serverOptions.proxy = proxyOptions;
  }

  return serverOptions;
}

function createProxyOptions<E extends AdminViteEnv>(
  proxy: false | AdminViteProxyOptions<E> | undefined,
  context: AdminViteConfigContext<E>
): ViteServerOptions['proxy'] | undefined {
  if (proxy === false) return undefined;

  return createAdminViteProxy({
    enabled:
      resolveConfigValue(proxy?.enabled, context) ??
      (context.isServe && !context.isPreview && context.env.VITE_HTTP_PROXY === 'Y'),
    enableLog: resolveConfigValue(proxy?.enableLog, context) ?? context.env.VITE_PROXY_LOG === 'Y',
    serviceConfig: resolveConfigValue(proxy?.serviceConfig, context) ?? createAdminViteServiceConfig(context.env)
  });
}

function resolvePluginOptions<T>(config: MaybePluginConfig<T> | undefined): T | undefined {
  if (config === false) return undefined;

  return config;
}

function resolveConfigValue<T, E extends AdminViteEnv>(
  value: AdminViteConfigValue<T, E> | undefined,
  context: AdminViteConfigContext<E>
): T | undefined {
  if (typeof value === 'function') {
    return (value as (context: AdminViteConfigContext<E>) => T)(context);
  }

  return value;
}
