import { devtools } from '@tanstack/devtools-vite';
import type { PluginOption } from 'vite';
import inspect from 'vite-plugin-inspect';
import removeConsole from 'vite-plugin-remove-console';

import type { AdminVitePluginAppendOptions, MaybePluginConfig } from '../types';
import { type SetupAdminAutoImportOptions, setupAdminAutoImport } from './auto-import';
import { type SetupAdminBabelPluginOptions, setupAdminBabelPlugin } from './babel';
import { type SetupAdminHtmlPluginOptions, setupAdminHtmlPlugin } from './html';
import { type SetupAdminProjectInfoOptions, setupAdminProjectInfo } from './info';
import { type SetupAdminReactPluginOptions, setupAdminReactPlugin } from './react';
import { type SetupAdminRouterPluginOptions, setupAdminRouterPlugins } from './router';
import { type SetupAdminUnocssOptions, setupAdminUnocss } from './unocss';
import { type SetupAdminUnpluginIconOptions, setupAdminUnpluginIcon } from './unplugin-icon';

type InspectOptions = NonNullable<Parameters<typeof inspect>[0]>;
type RemoveConsoleOptions = NonNullable<Parameters<typeof removeConsole>[0]>;

export * from './auto-import';
export * from './babel';
export * from './html';
export * from './info';
export * from './react';
export * from './router';
export * from './unocss';
export * from './unplugin-icon';

export interface SetupAdminVitePluginsConfig extends AdminVitePluginAppendOptions {
  /** Auto import plugin config. */
  autoImport?: MaybePluginConfig<SetupAdminAutoImportOptions>;

  /** Babel transform config for React Compiler and atom development helpers. */
  babel?: MaybePluginConfig<SetupAdminBabelPluginOptions>;

  /** TanStack DevTools Vite plugin switch. */
  devtools?: boolean;

  /** Html build meta plugin config. */
  html?: MaybePluginConfig<Partial<SetupAdminHtmlPluginOptions>>;

  /** Vite inspect plugin config. */
  inspect?: MaybePluginConfig<InspectOptions>;

  /** Project terminal info plugin config. */
  projectInfo?: MaybePluginConfig<SetupAdminProjectInfoOptions>;

  /** React plugin config. */
  react?: MaybePluginConfig<SetupAdminReactPluginOptions>;

  /** Remove-console plugin config. */
  removeConsole?: MaybePluginConfig<RemoveConsoleOptions>;

  /** TanStack Router plugin config. */
  router?: MaybePluginConfig<SetupAdminRouterPluginOptions>;

  /** UnoCSS icon preset config. */
  unocss?: MaybePluginConfig<SetupAdminUnocssOptions>;

  /** Local svg and icon component plugin config. */
  unpluginIcon?: MaybePluginConfig<SetupAdminUnpluginIconOptions>;
}

export interface SetupAdminVitePluginsOptions {
  /** Build time injected into html when html plugin is enabled. */
  buildTime: string;

  /** Built-in plugin switches, options, and custom plugin insertion points. */
  plugins?: SetupAdminVitePluginsConfig;
}

export function setupAdminVitePlugins(options: SetupAdminVitePluginsOptions) {
  const { buildTime, plugins: pluginConfig = {} } = options;
  const plugins: PluginOption[] = [...(pluginConfig.prependPlugins ?? [])];
  const enableReactPlugin = pluginConfig.react !== false;

  if (pluginConfig.devtools !== false) {
    plugins.push(devtools());
  }

  if (pluginConfig.router !== false) {
    plugins.push(...setupAdminRouterPlugins(resolvePluginOptions(pluginConfig.router)));
  }

  if (enableReactPlugin) {
    plugins.push(setupAdminReactPlugin(resolvePluginOptions(pluginConfig.react)));
  }

  if (pluginConfig.babel !== false && (enableReactPlugin || pluginConfig.babel)) {
    plugins.push(setupAdminBabelPlugin(resolvePluginOptions(pluginConfig.babel)));
  }

  if (pluginConfig.unocss !== false) {
    plugins.push(setupAdminUnocss(resolvePluginOptions(pluginConfig.unocss)));
  }

  if (pluginConfig.unpluginIcon !== false) {
    plugins.push(...setupAdminUnpluginIcon(resolvePluginOptions(pluginConfig.unpluginIcon)));
  }

  if (pluginConfig.autoImport !== false) {
    plugins.push(setupAdminAutoImport(resolvePluginOptions(pluginConfig.autoImport)));
  }

  if (pluginConfig.html !== false) {
    plugins.push(
      setupAdminHtmlPlugin({
        buildTime,
        ...resolvePluginOptions(pluginConfig.html)
      })
    );
  }

  if (pluginConfig.inspect !== false) {
    plugins.push(inspect(resolvePluginOptions(pluginConfig.inspect)));
  }

  if (pluginConfig.removeConsole !== false) {
    plugins.push(removeConsole(resolvePluginOptions(pluginConfig.removeConsole)));
  }

  if (pluginConfig.projectInfo !== false) {
    plugins.push(setupAdminProjectInfo(resolvePluginOptions(pluginConfig.projectInfo)));
  }

  plugins.push(...(pluginConfig.appendPlugins ?? []));

  return plugins;
}

function resolvePluginOptions<T>(config: MaybePluginConfig<T> | undefined): T | undefined {
  if (config === false) return undefined;

  return config;
}
