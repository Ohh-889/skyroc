import { describe, expect, it } from 'vitest';

import { parseRealtimeReady } from './message';

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
