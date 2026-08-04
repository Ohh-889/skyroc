import { request } from '@/service/request';

export interface WebSocketPushRequest {
  /** 通知正文。 */
  content: string;
  /** 通知标题。 */
  title: string;
  /** 通知类型。 */
  type: 'error' | 'info' | 'message' | 'success' | 'warning';
}

export interface WebSocketPushResponse {
  /** 当前后端实例成功投递的连接数。 */
  local_connections: number;
}

export function pushWebSocketMessage(data: WebSocketPushRequest) {
  return request<WebSocketPushResponse>({
    data,
    method: 'post',
    url: '/websocket/push'
  });
}
