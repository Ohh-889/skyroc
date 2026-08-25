import { useContext } from 'react';

import { NotificationContext } from './NotificationContext';

/** Read the current notification context. */
export function useNotificationContext() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }

  return context;
}
