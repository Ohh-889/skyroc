import { useNotificationContext } from '@skyroc/web-admin-notification';
import { useEffect, useRef } from 'react';

import { useAuthToken } from '@/features/auth/use-auth';

import { WebSocketClient } from './client';
import { parseWebSocketNotification } from './message';
import {
  bindWebSocketClient,
  releaseWebSocketClient,
  reportWebSocketMessage,
  setWebSocketConnectionStatus
} from './runtime';

const websocketEnabled = import.meta.env.VITE_WEBSOCKET_ENABLED === 'Y';
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

const WebSocketEffect = () => {
  const token = useAuthToken();
  const { addNotification } = useNotificationContext();
  const addNotificationRef = useRef(addNotification);
  addNotificationRef.current = addNotification;

  useEffect(() => {
    if (!websocketEnabled || !websocketUrl || !token) {
      return;
    }

    const client = new WebSocketClient({
      clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
      heartbeatInterval: 25_000,
      heartbeatTimeout: 10_000,
      onClose() {
        setWebSocketConnectionStatus('disconnected');
      },
      onMessage(message) {
        reportWebSocketMessage(message);
        const notification = parseWebSocketNotification(message);

        if (notification) {
          addNotificationRef.current(notification);
        }
      },
      onReady() {
        setWebSocketConnectionStatus('connected');
      },
      token,
      url: websocketUrl
    });

    bindWebSocketClient(client);
    client.connect();

    return () => {
      releaseWebSocketClient(client);
      client.disconnect();
    };
  }, [token]);

  return null;
};

export default WebSocketEffect;
