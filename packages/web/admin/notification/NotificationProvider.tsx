import type { ReactNode } from 'react';

import type { NotificationStore } from './notification-store';
import { NotificationContext } from './NotificationContext';
import type { NotificationConfig, NotificationItem } from './types';
import { useNotification } from './use-notification';

export interface NotificationProviderProps {
  /** Application content that can consume the notification context. */
  children: ReactNode;
  /**
   * Initial configuration merged with the package defaults. Ignored when `store` is provided — pass it to the store
   * instead.
   */
  defaultConfig?: Partial<NotificationConfig>;
  /** Callback fired when a browser notification cannot be displayed. */
  onBrowserNotificationError?: (error: unknown) => void;
  /** Callback fired when the current browser has no Notification API. */
  onBrowserNotificationUnsupported?: () => void;
  /** Callback fired when a browser notification link should be opened. */
  onNavigate?: (link: string, notification: NotificationItem) => void;
  /** Callback fired when the notification sound cannot be played. */
  onPlaySoundError?: (error: unknown) => void;
  /** Callback fired when requesting notification permission fails. */
  onRequestPermissionError?: (error: unknown) => void;
  /** Optional notification sound URL owned by the host app. */
  soundUrl?: string;
  /** Existing store to reuse, so non-React callers can push into the same queue. */
  store?: NotificationStore;
}

const NotificationProvider = (props: NotificationProviderProps) => {
  const {
    children,
    defaultConfig,
    onBrowserNotificationError,
    onBrowserNotificationUnsupported,
    onNavigate,
    onPlaySoundError,
    onRequestPermissionError,
    soundUrl,
    store
  } = props;

  const notification = useNotification({
    defaultConfig,
    onBrowserNotificationError,
    onBrowserNotificationUnsupported,
    onNavigate,
    onPlaySoundError,
    onRequestPermissionError,
    soundUrl,
    store
  });

  return <NotificationContext.Provider value={notification}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
