import { extend } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

export interface SetupDayjsOptions {
  /** Syncs the host application locale into Dayjs. */
  syncLocale?: () => void;

  /** Whether to register Dayjs localeData plugin. */
  withLocaleData?: boolean;
}

export function setupDayjs(options: SetupDayjsOptions = {}) {
  const { syncLocale, withLocaleData = true } = options;

  if (withLocaleData) {
    extend(localeData);
  }

  syncLocale?.();
}
