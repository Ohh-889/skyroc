import { describe, expect, it } from 'vitest';

import { parseRealtimeNotification, parseRealtimeReady } from './message';

describe('parseRealtimeReady', () => {
  it('reads the connection info the backend announces', () => {
    const message = JSON.stringify({
      code: '0001',
      data: { connection_id: '8d30f14b', transport: 'sse', user_id: 42 },
      msg: '连接成功',
      msg_id: '3f2a',
      request_id: null,
      type: 'system.connection.ready'
    });

    expect(parseRealtimeReady(message)).toEqual({
      connection_id: '8d30f14b',
      transport: 'sse',
      user_id: 42
    });
  });

  it('ignores a business message that merely succeeded', () => {
    const message = JSON.stringify({
      code: '0000',
      data: { content: '订单已支付' },
      msg: 'ok',
      type: 'order.payment.succeeded'
    });

    expect(parseRealtimeReady(message)).toBeNull();
  });

  it('ignores an envelope without a type', () => {
    const message = JSON.stringify({
      code: '0001',
      data: { connection_id: '8d30f14b', transport: 'sse', user_id: 42 },
      msg: '连接成功'
    });

    expect(parseRealtimeReady(message)).toBeNull();
  });

  it('ignores anything that is not valid json', () => {
    expect(parseRealtimeReady('pong')).toBeNull();
  });
});

describe('parseRealtimeNotification', () => {
  // WebSocket 和 SSE 同时连着，同一条推送会到两次，通知中心靠这个 id 去重
  it('carries the delivery id so both transports produce the same notification', () => {
    const message = JSON.stringify({
      code: '0000',
      data: { body: { content: '订单已支付', title: '订单' } },
      msg: 'ok',
      msg_id: 'delivery-1',
      type: 'order.payment.succeeded'
    });

    expect(parseRealtimeNotification(message)?.id).toBe('delivery-1');
  });

  it('lets the message body override the delivery id', () => {
    const message = JSON.stringify({
      code: '0000',
      data: { body: { content: '订单已支付', id: 'own-id', title: '订单' } },
      msg: 'ok',
      msg_id: 'delivery-1',
      type: 'order.payment.succeeded'
    });

    expect(parseRealtimeNotification(message)?.id).toBe('own-id');
  });

  it('carries the delivery id on a failed envelope too', () => {
    const message = JSON.stringify({
      code: '4030',
      data: null,
      msg: '没有权限',
      msg_id: 'delivery-2',
      type: 'message.direct.created'
    });

    expect(parseRealtimeNotification(message)).toMatchObject({ id: 'delivery-2', type: 'error' });
  });

  it('leaves a garbled frame without an id, so every failure stays visible', () => {
    expect(parseRealtimeNotification('{ not json')?.id).toBeUndefined();
  });

  it('ignores protocol handshakes and command receipts', () => {
    const ready = JSON.stringify({ code: '0001', data: null, msg: 'ok', type: 'system.connection.ready' });
    const receipt = JSON.stringify({ code: '0000', data: null, msg: 'ok', type: 'message.direct.send.result' });

    expect(parseRealtimeNotification(ready)).toBeNull();
    expect(parseRealtimeNotification(receipt)).toBeNull();
  });
});
