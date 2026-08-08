import { NotificationStore } from '@skyroc/web-admin-notification';

let store: NotificationStore | null = null;

/**
 * 全应用共用的那一份通知队列。
 *
 * 惰性建单例而不是交给 Provider 持有：WebSocket 和 SSE 的消息回调在 React 树之外，拿不到 Context。 App.tsx 把这个实例传给 NotificationProvider，两边读写的就是同一份。
 */
export function getAppNotificationStore(): NotificationStore {
  store ??= new NotificationStore();

  return store;
}
