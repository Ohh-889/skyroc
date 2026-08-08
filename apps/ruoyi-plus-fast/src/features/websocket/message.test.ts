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
          msg: 'ok',
          type: 'task.job.finished'
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
          msg: '消息已发布',
          type: 'order.payment.succeeded'
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

  it('shows the body of a delivered message, not the delivery metadata', () => {
    const message = JSON.stringify({
      code: '0000',
      data: {
        body: { content: '前端主动发送的测试消息', title: '前端消息', type: 'info' },
        message_id: '9b1c',
        sender_id: 1
      },
      msg: 'ok',
      msg_id: '4d7e',
      request_id: null,
      type: 'message.direct.created'
    });

    expect(parseWebSocketNotification(message)).toEqual({
      content: '前端主动发送的测试消息',
      id: '4d7e',
      title: '前端消息',
      type: 'info'
    });
  });

  it('does not notify about the reply to a command it sent itself', () => {
    const message = JSON.stringify({
      code: '0000',
      data: { message_id: '9b1c' },
      msg: 'ok',
      request_id: 'c_1',
      type: 'message.direct.send.result'
    });

    expect(parseWebSocketNotification(message)).toBeNull();
  });

  it('turns an error envelope into an error notification', () => {
    const message = JSON.stringify({
      code: '403',
      data: null,
      msg: '没有权限发送给指定用户',
      request_id: 'c_1',
      type: 'system.message.error'
    });

    expect(parseWebSocketNotification(message)).toEqual({
      content: '没有权限发送给指定用户',
      title: '实时推送错误',
      type: 'error'
    });
  });

  it('does not notify about the connection-ready envelope', () => {
    const message = JSON.stringify({
      code: '0001',
      data: { connection_id: 'abc', transport: 'websocket', user_id: 7 },
      msg: '连接成功',
      type: 'system.connection.ready'
    });

    expect(parseWebSocketNotification(message)).toBeNull();
  });
});
