/**
 * 通过 WebSocket 发消息。
 *
 * 写成普通函数不是 hook：这里不持有任何 React 状态，做成 hook 之后 store、事件回调、路由 loader 里就调不了了。等以后要等回执、要 pending 状态，再在这之上包一层 hook。
 */

import { getAppWebSocketClient } from '@/features/websocket/use-websocket';

import { BROADCAST_SEND, DIRECT_SEND } from './constants';

/**
 * 投给指定的人，返回这条命令的 id；没连上返回 null。
 *
 * `recipients` 是收件人的 userId 列表，不能为空 —— 想群发要显式调 `sendBroadcast`，两者的 权限判定完全不同，靠「收件人为空」猜意图会让一次手滑的定向投递变成群发。
 *
 * 谁能发给谁由服务端判定，骨架的规则只放行「发给自己」，填别人会拿到 403。
 */
export function sendDirectMessage(recipients: number[], body: unknown): string | null {
  return getAppWebSocketClient().sendCommand(DIRECT_SEND, { body, recipients });
}

/**
 * 发给本租户的全部在线连接，返回这条命令的 id；没连上返回 null。
 *
 * 没有租户参数：范围固定是发送者自己的租户，由服务端取，接受客户端指定等于让人自己挑要 广播给哪个租户。骨架只放行超管。
 */
export function sendBroadcast(body: unknown): string | null {
  return getAppWebSocketClient().sendCommand(BROADCAST_SEND, { body });
}
