import { useEffect } from 'react';

import { useAuthToken } from '@/features/auth/use-auth';
import { getAppNotificationStore } from '@/features/notification/store';
import { parseRealtimeNotification } from '@/features/realtime/message';

import { getAppSseClient } from './use-sse';

const SseEffect = () => {
  const token = useAuthToken();

  const isLoggedIn = Boolean(token);

  // 依赖登录与否而不是令牌本身：续签换了令牌不该断掉一条正常的连接，
  // 真需要换的时候后端会发 4001，客户端自己会续签重连。
  useEffect(() => {
    if (!isLoggedIn) return;

    const client = getAppSseClient();

    const notifications = getAppNotificationStore();

    const offMessage = client.on('message', raw => {
      const notification = parseRealtimeNotification(raw);

      if (notification) {
        notifications.add(notification);
      }
    });

    client.connect();

    return () => {
      offMessage();
      client.disconnect();
    };
  }, [isLoggedIn]);

  return null;
};

export default SseEffect;
