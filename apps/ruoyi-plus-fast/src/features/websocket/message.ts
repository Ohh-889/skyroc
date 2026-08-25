import type { AddNotificationInput } from '@shell/notification';

import { parseRealtimeNotification } from '@/features/realtime/message';

export function parseWebSocketNotification(message: string): AddNotificationInput | null {
  // 心跳响应至今还是裸字符串，不走 code/msg/data 信封，只能在这儿单独挡掉
  if (message === 'pong') {
    return null;
  }

  return parseRealtimeNotification(message);
}
