import { createContext } from 'react';

import type { useNotification } from './use-notification';

/** Value exposed by the notification provider. */
export type NotificationContextValue = ReturnType<typeof useNotification>;

export const NotificationContext = createContext<NotificationContextValue | null>(null);
