import { addAPIProvider } from '@iconify/react';

export interface SetupIconifyOfflineOptions {
  /** Iconify API URL used by the host application. */
  apiUrl?: string;

  /** Iconify provider name. Empty string configures the default provider. */
  provider?: string;
}

export function setupIconifyOffline(options: SetupIconifyOfflineOptions = {}) {
  const { apiUrl, provider = '' } = options;

  if (apiUrl) {
    addAPIProvider(provider, { resources: [apiUrl] });
  }
}
