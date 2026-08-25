import { describe, expect, it, vi } from 'vitest';

import { NotificationStore } from '@shell/notification/notification-store';
import type { AddNotificationInput } from '@shell/notification/types';

function input(overrides: Partial<AddNotificationInput> = {}): AddNotificationInput {
  return { content: '正文', title: '标题', type: 'info', ...overrides };
}

// ==================== 去重 ====================

describe('NotificationStore: 去重', () => {
  it('同一个 id 推两次只留一条', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'msg-1' }));
    store.add(input({ content: '重复投递', id: 'msg-1' }));

    expect(store.getSnapshot().notifications).toHaveLength(1);
  });

  it('重复投递保留先到的那条内容', () => {
    const store = new NotificationStore();

    store.add(input({ content: '先到', id: 'msg-1' }));
    store.add(input({ content: '后到', id: 'msg-1' }));

    expect(store.getSnapshot().notifications[0].content).toBe('先到');
  });

  it('重复投递不再通知订阅方，界面不会闪一下', () => {
    const store = new NotificationStore();
    const listener = vi.fn();

    store.add(input({ id: 'msg-1' }));
    store.subscribe(listener);
    store.add(input({ id: 'msg-1' }));

    expect(listener).not.toHaveBeenCalled();
  });

  it('没带 id 的两条不会被当成重复', () => {
    const store = new NotificationStore();

    store.add(input());
    store.add(input());

    expect(store.getSnapshot().notifications).toHaveLength(2);
  });

  it('add 返回实际使用的 id', () => {
    const store = new NotificationStore();

    expect(store.add(input({ id: 'msg-1' }))).toBe('msg-1');
    expect(store.add(input())).toEqual(expect.any(String));
  });
});

// ==================== 排序 ====================

describe('NotificationStore: 排序', () => {
  it('优先级高的排在前面', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a', priority: 'low' }));
    store.add(input({ id: 'b', priority: 'urgent' }));
    store.add(input({ id: 'c', priority: 'normal' }));

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['b', 'c', 'a']);
  });

  it('没标优先级的按 normal 算', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a', priority: 'low' }));
    store.add(input({ id: 'b' }));

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['b', 'a']);
  });

  it('同优先级按时间倒序', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'old', timestamp: 100 }));
    store.add(input({ id: 'new', timestamp: 200 }));

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['new', 'old']);
  });

  it('时间戳撞在一起时后进的排前面', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'first', timestamp: 100 }));
    store.add(input({ id: 'second', timestamp: 100 }));

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['second', 'first']);
  });

  it('标记已读不会改变顺序', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a', timestamp: 200 }));
    store.add(input({ id: 'b', timestamp: 100 }));
    store.markAsRead('a');

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['a', 'b']);
  });
});

// ==================== 已读与移除 ====================

describe('NotificationStore: 已读与移除', () => {
  it('新增的通知默认未读', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a' }));

    expect(store.getSnapshot().unreadCount).toBe(1);
  });

  it('标记已读后未读数减少', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a' }));
    store.markAsRead('a');

    expect(store.getSnapshot().unreadCount).toBe(0);
    expect(store.getSnapshot().notifications[0].read).toBe(true);
  });

  it('重复标记已读不再通知订阅方', () => {
    const store = new NotificationStore();
    const listener = vi.fn();

    store.add(input({ id: 'a' }));
    store.markAsRead('a');
    store.subscribe(listener);
    store.markAsRead('a');

    expect(listener).not.toHaveBeenCalled();
  });

  it('全部标记已读只通知一次', () => {
    const store = new NotificationStore();
    const listener = vi.fn();

    store.add(input({ id: 'a' }));
    store.add(input({ id: 'b' }));
    store.subscribe(listener);
    store.markAllAsRead();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().unreadCount).toBe(0);
  });

  it('清除已读只留下未读', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a' }));
    store.add(input({ id: 'b' }));
    store.markAsRead('a');
    store.clearRead();

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['b']);
  });

  it('移除之后同一个 id 可以重新入队', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a' }));
    store.remove('a');
    store.add(input({ content: '再来一条', id: 'a' }));

    expect(store.getSnapshot().notifications).toHaveLength(1);
    expect(store.getSnapshot().notifications[0].content).toBe('再来一条');
  });
});

// ==================== 快照 ====================

describe('NotificationStore: 快照', () => {
  it('没有写操作时快照引用不变', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a' }));

    expect(store.getSnapshot()).toBe(store.getSnapshot());
  });

  it('写操作后拿到的是新快照', () => {
    const store = new NotificationStore();

    const before = store.getSnapshot();
    store.add(input({ id: 'a' }));

    expect(store.getSnapshot()).not.toBe(before);
  });

  it('取消订阅后不再收到通知', () => {
    const store = new NotificationStore();
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.add(input({ id: 'a' }));

    expect(listener).not.toHaveBeenCalled();
  });
});

// ==================== 配置 ====================

describe('NotificationStore: 配置', () => {
  it('构造时传入的配置会与默认配置合并', () => {
    const store = new NotificationStore({ defaultConfig: { soundEnabled: false } });

    expect(store.getSnapshot().config.soundEnabled).toBe(false);
    expect(store.getSnapshot().config.browserNotificationEnabled).toBe(true);
  });

  it('超出上限时丢掉排最后的那条', () => {
    const store = new NotificationStore({ defaultConfig: { maxNotifications: 2 } });

    store.add(input({ id: 'a', priority: 'urgent' }));
    store.add(input({ id: 'b', priority: 'high' }));
    store.add(input({ id: 'c', priority: 'low' }));

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['a', 'b']);
  });

  it('调小上限后立刻裁到新上限', () => {
    const store = new NotificationStore();

    store.add(input({ id: 'a', priority: 'urgent' }));
    store.add(input({ id: 'b', priority: 'low' }));
    store.updateConfig({ maxNotifications: 1 });

    expect(store.getSnapshot().notifications.map(item => item.id)).toEqual(['a']);
  });

  it('改配置会通知订阅方', () => {
    const store = new NotificationStore();
    const listener = vi.fn();

    store.subscribe(listener);
    store.updateConfig({ doNotDisturb: true });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot().config.doNotDisturb).toBe(true);
  });
});
