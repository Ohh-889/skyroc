import { describe, expect, it, vi } from 'vitest';
import { PriorityQueue } from '../src/priority-queue';

type Task = { createdAt: number; priority: number; taskId: string };

function createQueue() {
  return new PriorityQueue<Task>({
    getId: t => t.taskId,
    compare: (a, b) => a.priority - b.priority || a.createdAt - b.createdAt
  });
}

function task(id: string, priority: number, createdAt = 0): Task {
  return { taskId: id, priority, createdAt };
}

// ==================== enqueue ====================

describe('PriorityQueue: enqueue', () => {
  it('入队后 size 应增加', () => {
    const q = createQueue();

    q.enqueue(task('1', 1));

    expect(q.size).toBe(1);
    expect(q.isEmpty).toBe(false);
  });

  it('入队应返回 true', () => {
    const q = createQueue();
    expect(q.enqueue(task('1', 1))).toBe(true);
  });

  it('重复 id 入队应被跳过并返回 false', () => {
    const q = createQueue();

    q.enqueue(task('1', 1));
    const result = q.enqueue(task('1', 2));

    expect(result).toBe(false);
    expect(q.size).toBe(1);
  });

  it('入队后应按优先级排序', () => {
    const q = createQueue();

    q.enqueue(task('c', 3));
    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));

    const ids = q.toArray().map(t => t.taskId);
    expect(ids).toEqual(['a', 'b', 'c']);
  });

  it('相同优先级应按 createdAt 排序', () => {
    const q = createQueue();

    q.enqueue(task('late', 1, 200));
    q.enqueue(task('early', 1, 100));

    const ids = q.toArray().map(t => t.taskId);
    expect(ids).toEqual(['early', 'late']);
  });
});

// ==================== enqueueMany ====================

describe('PriorityQueue: enqueueMany', () => {
  it('批量入队应返回实际入队数量', () => {
    const q = createQueue();

    const added = q.enqueueMany([task('1', 1), task('2', 2), task('3', 3)]);

    expect(added).toBe(3);
    expect(q.size).toBe(3);
  });

  it('批量入队应跳过已存在的 id', () => {
    const q = createQueue();

    q.enqueue(task('1', 1));
    const added = q.enqueueMany([task('1', 9), task('2', 2)]);

    expect(added).toBe(1);
    expect(q.size).toBe(2);
  });

  it('全部重复时不触发排序（返回 0）', () => {
    const q = createQueue();

    q.enqueue(task('1', 1));
    const added = q.enqueueMany([task('1', 9)]);

    expect(added).toBe(0);
  });
});

// ==================== dequeue ====================

describe('PriorityQueue: dequeue', () => {
  it('dequeue 应移除并返回最高优先级 item', () => {
    const q = createQueue();

    q.enqueue(task('low', 10));
    q.enqueue(task('high', 1));

    const item = q.dequeue();
    expect(item?.taskId).toBe('high');
    expect(q.size).toBe(1);
  });

  it('空队列 dequeue 应返回 undefined', () => {
    const q = createQueue();
    expect(q.dequeue()).toBeUndefined();
  });

  it('连续 dequeue 应按优先级顺序返回', () => {
    const q = createQueue();

    q.enqueue(task('c', 3));
    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));

    expect(q.dequeue()?.taskId).toBe('a');
    expect(q.dequeue()?.taskId).toBe('b');
    expect(q.dequeue()?.taskId).toBe('c');
    expect(q.dequeue()).toBeUndefined();
  });
});

// ==================== peek ====================

describe('PriorityQueue: peek', () => {
  it('peek 应返回队首但不移除', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));

    expect(q.peek()?.taskId).toBe('a');
    expect(q.size).toBe(2);
  });

  it('空队列 peek 应返回 undefined', () => {
    const q = createQueue();
    expect(q.peek()).toBeUndefined();
  });
});

// ==================== remove / removeBy ====================

describe('PriorityQueue: remove', () => {
  it('按 id 移除应返回 true', () => {
    const q = createQueue();

    q.enqueue(task('1', 1));
    expect(q.remove('1')).toBe(true);
    expect(q.size).toBe(0);
  });

  it('移除不存在的 id 应返回 false', () => {
    const q = createQueue();
    expect(q.remove('nope')).toBe(false);
  });
});

describe('PriorityQueue: removeBy', () => {
  it('按条件批量移除应返回移除数量', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    q.enqueue(task('b', 5));
    q.enqueue(task('c', 10));

    const removed = q.removeBy(t => t.priority >= 5);

    expect(removed).toBe(2);
    expect(q.size).toBe(1);
    expect(q.toArray().map(t => t.taskId)).toEqual(['a']);
  });

  it('无匹配时应返回 0 且不触发通知', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.enqueue(task('a', 1));
    q.subscribe(listener);
    listener.mockClear();

    const removed = q.removeBy(() => false);

    expect(removed).toBe(0);
    expect(listener).not.toHaveBeenCalled();
  });
});

// ==================== update / updateBy ====================

describe('PriorityQueue: update', () => {
  it('按 id 更新应替换掉原来的 item', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    const result = q.update('a', prev => ({ ...prev, priority: 9 }));

    expect(result).toBe(true);
    expect(q.get('a')?.priority).toBe(9);
    expect(q.size).toBe(1);
  });

  it('更新不存在的 id 应返回 false 且不通知', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.subscribe(listener);
    const result = q.update('nope', prev => prev);

    expect(result).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it('updater 原样返回入参时应算作没改动', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.enqueue(task('a', 1));
    q.subscribe(listener);
    const result = q.update('a', prev => prev);

    expect(result).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });

  it('更新后应按新的优先级重排', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));
    q.update('a', prev => ({ ...prev, priority: 99 }));

    expect(q.toArray().map(t => t.taskId)).toEqual(['b', 'a']);
  });

  it('更新只通知一次，订阅方看不到中间状态', () => {
    const q = createQueue();
    const sizes: number[] = [];

    q.enqueue(task('a', 1));
    q.subscribe(sorted => sizes.push(sorted.length));
    q.update('a', prev => ({ ...prev, priority: 2 }));

    expect(sizes).toEqual([1]);
  });
});

describe('PriorityQueue: updateBy', () => {
  it('按条件批量更新应返回更新数量', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    q.enqueue(task('b', 5));
    q.enqueue(task('c', 10));

    const updated = q.updateBy(
      t => t.priority >= 5,
      t => ({ ...t, priority: 0 })
    );

    expect(updated).toBe(2);
    expect(q.toArray().map(t => t.priority)).toEqual([0, 0, 1]);
  });

  it('无匹配时应返回 0 且不触发通知', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.enqueue(task('a', 1));
    q.subscribe(listener);

    const updated = q.updateBy(
      () => false,
      t => t
    );

    expect(updated).toBe(0);
    expect(listener).not.toHaveBeenCalled();
  });

  it('匹配上但 updater 原样返回的不计入更新数量', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));

    const updated = q.updateBy(
      () => true,
      t => (t.taskId === 'a' ? { ...t, priority: 0 } : t)
    );

    expect(updated).toBe(1);
  });
});

// ==================== capacity ====================

describe('PriorityQueue: capacity', () => {
  function createCappedQueue(capacity: number) {
    return new PriorityQueue<Task>({
      capacity,
      compare: (a, b) => a.priority - b.priority,
      getId: t => t.taskId
    });
  }

  it('超出容量时应裁掉排序后末尾的项', () => {
    const q = createCappedQueue(2);

    q.enqueue(task('low', 10));
    q.enqueue(task('high', 1));
    q.enqueue(task('mid', 5));

    expect(q.toArray().map(t => t.taskId)).toEqual(['high', 'mid']);
  });

  it('被裁掉的项也应从存储里删掉，has 查不到', () => {
    const q = createCappedQueue(1);

    q.enqueue(task('high', 1));
    q.enqueue(task('low', 10));

    expect(q.size).toBe(1);
    expect(q.has('low')).toBe(false);
  });

  it('批量入队超容量时也只保留前 capacity 条', () => {
    const q = createCappedQueue(2);

    q.enqueueMany([task('c', 3), task('a', 1), task('b', 2)]);

    expect(q.toArray().map(t => t.taskId)).toEqual(['a', 'b']);
  });

  it('不传 capacity 时不裁剪', () => {
    const q = createQueue();

    q.enqueueMany([task('a', 1), task('b', 2), task('c', 3)]);

    expect(q.size).toBe(3);
  });
});

// ==================== clear ====================

describe('PriorityQueue: clear', () => {
  it('clear 应清空队列', () => {
    const q = createQueue();

    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));
    q.clear();

    expect(q.size).toBe(0);
    expect(q.isEmpty).toBe(true);
    expect(q.toArray()).toEqual([]);
  });

  it('空队列 clear 不触发通知', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.subscribe(listener);
    q.clear();

    expect(listener).not.toHaveBeenCalled();
  });
});

// ==================== has / get ====================

describe('PriorityQueue: has / get', () => {
  it('has 存在的 id 应返回 true', () => {
    const q = createQueue();

    q.enqueue(task('1', 1));

    expect(q.has('1')).toBe(true);
    expect(q.has('2')).toBe(false);
  });

  it('get 应返回对应 item', () => {
    const q = createQueue();
    const t = task('1', 1);

    q.enqueue(t);

    expect(q.get('1')).toBe(t);
    expect(q.get('2')).toBeUndefined();
  });
});

// ==================== subscribe ====================

describe('PriorityQueue: subscribe', () => {
  it('enqueue 后应通知监听器', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.subscribe(listener);
    q.enqueue(task('a', 1));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(q.toArray());
  });

  it('dequeue 后应通知监听器', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.enqueue(task('a', 1));
    q.subscribe(listener);
    q.dequeue();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('remove 后应通知监听器', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.enqueue(task('a', 1));
    q.subscribe(listener);
    q.remove('a');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('clear 后应通知监听器', () => {
    const q = createQueue();
    const listener = vi.fn();

    q.enqueue(task('a', 1));
    q.subscribe(listener);
    listener.mockClear();
    q.clear();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('取消订阅后不再收到通知', () => {
    const q = createQueue();
    const listener = vi.fn();

    const unsub = q.subscribe(listener);
    unsub();
    q.enqueue(task('a', 1));

    expect(listener).not.toHaveBeenCalled();
  });

  it('多个监听器都应收到通知', () => {
    const q = createQueue();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    q.subscribe(fn1);
    q.subscribe(fn2);
    q.enqueue(task('a', 1));

    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});

// ==================== iterator ====================

describe('PriorityQueue: iterator', () => {
  it('for...of 应按优先级顺序遍历', () => {
    const q = createQueue();

    q.enqueue(task('c', 3));
    q.enqueue(task('a', 1));
    q.enqueue(task('b', 2));

    const ids: string[] = [];
    for (const item of q) {
      ids.push(item.taskId);
    }

    expect(ids).toEqual(['a', 'b', 'c']);
  });

  it('spread 操作应按优先级顺序', () => {
    const q = createQueue();

    q.enqueue(task('b', 2));
    q.enqueue(task('a', 1));

    const items = [...q];
    expect(items.map(t => t.taskId)).toEqual(['a', 'b']);
  });
});
