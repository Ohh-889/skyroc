/**
 * 连接状态。WebSocket 和 SSE 共用同一套，联调页和状态指示器不用为两条连接写两份文案表。
 *
 * 建连成功只算 connecting：两种传输都是握手完了才验凭据，收到服务端的就绪消息才算真的连上。
 */
export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'idle';
