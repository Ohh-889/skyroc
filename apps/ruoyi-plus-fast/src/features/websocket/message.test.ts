import { describe, expect, it } from 'vitest';

import { parseWebSocketNotification } from './message';

describe('parseWebSocketNotification', () => {
  it('filters the heartbeat response', () => {
    expect(parseWebSocketNotification('pong')).toBeNull();
  });

  it('unwraps a text payload', () => {
    expect(
      parseWebSocketNotification(
        JSON.stringify({
          code: '0000',
          data: '任务处理完成',
          msg: 'ok'
        })
      )
    ).toEqual({
      content: '任务处理完成',
      title: '系统通知',
      type: 'info'
    });
  });

  it('keeps the structured notification fields sent by the backend', () => {
    expect(
      parseWebSocketNotification(
        JSON.stringify({
          code: '0000',
          data: {
            content: '订单 ORD001 已支付',
            id: 'order-ORD001',
            link: '/orders/ORD001',
            priority: 'high',
            silent: true,
            title: '订单通知',
            type: 'success'
          },
          msg: '消息已发布'
        })
      )
    ).toEqual({
      content: '订单 ORD001 已支付',
      id: 'order-ORD001',
      link: '/orders/ORD001',
      priority: 'high',
      silent: true,
      title: '订单通知',
      type: 'success'
    });
  });

  it('turns an error envelope into an error notification', () => {
    const message = JSON.stringify({
      code: '400',
      data: null,
      msg: 'WebSocket 消息必须是 JSON 对象'
    });

    expect(parseWebSocketNotification(message)).toEqual({
      content: 'WebSocket 消息必须是 JSON 对象',
      title: '实时推送错误',
      type: 'error'
    });
  });

  it('does not notify about the connection-ready envelope', () => {
    const message = JSON.stringify({
      code: '0001',
      data: { connection_id: 'abc', transport: 'websocket', user_id: 7 },
      msg: '连接成功'
    });

    expect(parseWebSocketNotification(message)).toBeNull();
  });
});
