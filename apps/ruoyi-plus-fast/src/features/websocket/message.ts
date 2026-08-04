import type { AddNotificationInput } from '@skyroc/web-admin-notification';

import { parseRealtimeNotification } from '@/features/realtime/message';

export function parseWebSocketNotification(message: string): AddNotificationInput | null {
  // 心跳响应至今还是裸字符串，不走 code/msg/data 信封，只能在这儿单独挡掉
  if (message === 'pong') {
    return null;
  }

  return parseRealtimeNotification(message);
}
