import { useEffect, useRef, useSyncExternalStore } from 'react';

import { NotificationStore } from './notification-store';
import type { UseNotificationOptions } from './types';

export { DEFAULT_NOTIFICATION_CONFIG } from './notification-store';

/**
 * 订阅通知中心。
 *
 * 状态和副作用全在 NotificationStore 里，这里只做三件事：拿到实例、订阅快照、把方法转出去。 方法都是实例上的箭头属性，引用天然稳定，不用再包 useCallback。
 */
export function useNotification(options: UseNotificationOptions = {}) {
  const storeRef = useRef<NotificationStore | null>(null);

  // 传了 store 就用外面那个：推送侧要在 React 树之外投递通知，得和这里读的是同一份
  const store = options.store ?? (storeRef.current ??= new NotificationStore(options));

  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  useEffect(() => {
    store.syncPermission();
  }, [store]);

  // 不给依赖数组：Provider 每次渲染的回调都是新函数，每次都同步过去最省心。
  // 只赋值不通知，多跑几次没有代价。
  useEffect(() => {
    store.setOptions(options);
  });

  return {
    addErrorNotification: store.addError,
    addInfoNotification: store.addInfo,
    addMessageNotification: store.addMessage,
    addNotification: store.add,
    addSuccessNotification: store.addSuccess,
    addWarningNotification: store.addWarning,
    clearAllNotifications: store.clearAll,
    clearReadNotifications: store.clearRead,
    config: snapshot.config,
    markAllAsRead: store.markAllAsRead,
    markAsRead: store.markAsRead,
    notificationPermission: snapshot.permission,
    notifications: snapshot.notifications,
    removeNotification: store.remove,
    requestNotificationPermission: store.requestPermission,
    store,
    unreadCount: snapshot.unreadCount,
    updateConfig: store.updateConfig
  };
}
