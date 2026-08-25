import { setupAppVersionNotification } from './app-update';
import type { SetupAppVersionNotificationOptions } from './app-update';
import { setupDayjs } from './dayjs';
import type { SetupDayjsOptions } from './dayjs';
import { setupIconifyOffline } from './iconify';
import type { SetupIconifyOfflineOptions } from './iconify';
import { setupNProgress } from './nprogress';
import type { SetupNProgressOptions } from './nprogress';

export type AdminRuntimePluginConfig<T> = false | T;
export type AdminRuntimePluginCleanup = () => void;

export interface SetupAdminRuntimePluginsOptions {
  /** App update check config. Disabled until the host app provides the required notification options. */
  appVersionNotification?: AdminRuntimePluginConfig<SetupAppVersionNotificationOptions>;

  /** Dayjs runtime setup config. */
  dayjs?: AdminRuntimePluginConfig<SetupDayjsOptions>;

  /** Iconify offline provider config. */
  iconifyOffline?: AdminRuntimePluginConfig<SetupIconifyOfflineOptions>;

  /** NProgress runtime setup config. */
  nprogress?: AdminRuntimePluginConfig<SetupNProgressOptions>;
}

export function setupAdminRuntimePlugins(options: SetupAdminRuntimePluginsOptions = {}) {
  const { appVersionNotification, dayjs, iconifyOffline, nprogress } = options;
  const cleanups: AdminRuntimePluginCleanup[] = [];

  if (dayjs !== false) {
    setupDayjs(resolvePluginOptions(dayjs));
  }

  if (nprogress !== false) {
    setupNProgress(resolvePluginOptions(nprogress));
  }

  if (iconifyOffline !== false) {
    setupIconifyOffline(resolvePluginOptions(iconifyOffline));
  }

  if (appVersionNotification !== false && appVersionNotification !== undefined) {
    const cleanup = setupAppVersionNotification(appVersionNotification);

    if (cleanup) {
      cleanups.push(cleanup);
    }
  }

  return function cleanupAdminRuntimePlugins() {
    for (let index = cleanups.length - 1; index >= 0; index -= 1) {
      cleanups[index]();
    }
  };
}

function resolvePluginOptions<T>(config: AdminRuntimePluginConfig<T> | undefined): T | undefined {
  if (config === false) return undefined;

  return config;
}
