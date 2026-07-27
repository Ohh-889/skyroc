import { setupAdminRuntimePlugins } from '@skyroc/web-admin-runtime';
import type { SetupDayjsOptions, SetupIconifyOfflineOptions, SetupNProgressOptions } from '@skyroc/web-admin-runtime';

import { initNProgress } from '@/config';

import { createAdminAppVersionNotificationPluginOptions } from './app';

export * from './app';

const adminDayjsPluginOptions = {
  withLocaleData: true
} satisfies SetupDayjsOptions;

const adminIconifyOfflinePluginOptions = {
  apiUrl: import.meta.env.VITE_ICONIFY_URL
} satisfies SetupIconifyOfflineOptions;

const adminNProgressPluginOptions = {
  easing: 'ease',
  onReady: initNProgress,
  parent: '.root',
  speed: 500
} satisfies SetupNProgressOptions;

export function setupAdminPlugins() {
  return setupAdminRuntimePlugins({
    dayjs: adminDayjsPluginOptions,
    appVersionNotification: createAdminAppVersionNotificationPluginOptions(),
    iconifyOffline: adminIconifyOfflinePluginOptions,
    nprogress: adminNProgressPluginOptions
  });
}
