import { describe, expect, it } from 'vitest';

import { parseRealtimeReady } from './message';

describe('parseRealtimeReady', () => {
  it('reads the connection info the backend announces', () => {
    const message = JSON.stringify({
      code: '0001',
      data: { connection_id: '8d30f14b', transport: 'sse', user_id: 42 },
      msg: '连接成功'
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
      msg: 'ok'
    });

    expect(parseRealtimeReady(message)).toBeNull();
  });

  it('ignores anything that is not valid json', () => {
    expect(parseRealtimeReady('pong')).toBeNull();
  });
});
