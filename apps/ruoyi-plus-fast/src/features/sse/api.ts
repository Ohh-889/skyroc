import { request } from '@/service/request';

export interface SsePushRequest {
  /** 通知正文。 */
  content: string;
  /** 通知标题。 */
  title: string;
  /** 通知类型。 */
  type: 'error' | 'info' | 'message' | 'success' | 'warning';
}

export interface SsePushResponse {
  /** 当前后端实例成功投递的连接数，含该用户的 WebSocket 连接。 */
  local_connections: number;
}

export function pushSseMessage(data: SsePushRequest) {
  return request<SsePushResponse>({
    data,
    method: 'post',
    url: '/sse/push'
  });
}
