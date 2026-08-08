import { useNotificationContext } from '@skyroc/web-admin-notification';
import { useEffect, useRef } from 'react';

import { useAuthToken } from '@/features/auth/use-auth';

import { parseWebSocketNotification } from './message';
import { getAppWebSocketClient } from './use-websocket';

const WebSocketEffect = () => {
  const token = useAuthToken();
  const { addNotification } = useNotificationContext();
  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  const isLoggedIn = Boolean(token);

  // 依赖登录与否而不是令牌本身：续签换了令牌不该断掉一条正常的连接，
  // 重连时 getUrl 会现取新的那张。
  useEffect(() => {
    if (!isLoggedIn) return;

    const client = getAppWebSocketClient();

    const offMessage = client.on('message', raw => {
      const notification = parseWebSocketNotification(raw);

      if (notification) {
        addNotificationRef.current(notification);
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

export default WebSocketEffect;
