import { describe, expect, it, vi } from 'vitest';
import { Emitter } from '../src/emitter';

type TestEvents = {
  data: [payload: { id: number }];
  login: [user: string];
  logout: [];
};

// ==================== emit / on ====================

describe('Emitter: 基本发布/订阅', () => {
  it('on 注册后应收到 emit 发送的事件', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.on('login', fn);
    bus.emit('login', 'alice');

    expect(fn).toHaveBeenCalledWith('alice');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('多个监听器都应收到事件', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    bus.on('login', fn1);
    bus.on('login', fn2);
    bus.emit('login', 'bob');

    expect(fn1).toHaveBeenCalledWith('bob');
    expect(fn2).toHaveBeenCalledWith('bob');
  });

  it('不同事件之间互不影响', () => {
    const bus = new Emitter<TestEvents>();
    const loginFn = vi.fn();
    const logoutFn = vi.fn();

    bus.on('login', loginFn);
    bus.on('logout', logoutFn);
    bus.emit('login', 'charlie');

    expect(loginFn).toHaveBeenCalledTimes(1);
    expect(logoutFn).not.toHaveBeenCalled();
  });

  it('无参数事件应正常触发', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.on('logout', fn);
    bus.emit('logout');

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ==================== off ====================

describe('Emitter: off 取消订阅', () => {
  it('off 指定函数后该函数不再被调用', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.on('login', fn);
    bus.off('login', fn);
    bus.emit('login', 'alice');

    expect(fn).not.toHaveBeenCalled();
  });

  it('off 不传 fn 则移除该事件全部监听器', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    bus.on('login', fn1);
    bus.on('login', fn2);
    bus.off('login');
    bus.emit('login', 'alice');

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();
  });

  it('off 只有一个监听器时传 fn 应移除整个事件', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.on('login', fn);
    bus.off('login', fn);
    bus.emit('login', 'alice');

    expect(fn).not.toHaveBeenCalled();
  });

  it('off 多个监听器时传 fn 应只移除指定函数', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();

    bus.on('login', fn1);
    bus.on('login', fn2);
    bus.on('login', fn3);
    bus.off('login', fn2);
    bus.emit('login', 'alice');

    expect(fn1).toHaveBeenCalledWith('alice');
    expect(fn2).not.toHaveBeenCalled();
    expect(fn3).toHaveBeenCalledWith('alice');
  });

  it('off 只有一个监听器时传入别的函数，不应误删它', () => {
    // 回归：旧实现走 `fns.length === 1` 就整条删，没校验身份
    const bus = new Emitter<TestEvents>();
    const keep = vi.fn();
    const other = vi.fn();

    bus.on('login', keep);
    bus.off('login', other);
    bus.emit('login', 'alice');

    expect(keep).toHaveBeenCalledWith('alice');
  });

  it('off 对不存在的事件不报错', () => {
    const bus = new Emitter<TestEvents>();
    expect(() => bus.off('login')).not.toThrow();
  });

  it('on 返回的函数可用于取消订阅', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    const unsub = bus.on('login', fn);
    unsub();
    bus.emit('login', 'alice');

    expect(fn).not.toHaveBeenCalled();
  });
});

// ==================== 通配符 * ====================

describe('Emitter: 通配符 *', () => {
  it('通配符监听器应收到所有事件', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.on('*', fn);
    bus.emit('login', 'alice');
    bus.emit('logout');

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('login', 'alice');
    expect(fn).toHaveBeenCalledWith('logout');
  });

  it('通配符和具体监听器同时存在时都应触发', () => {
    const bus = new Emitter<TestEvents>();
    const wildcardFn = vi.fn();
    const loginFn = vi.fn();

    bus.on('*', wildcardFn);
    bus.on('login', loginFn);
    bus.emit('login', 'alice');

    expect(wildcardFn).toHaveBeenCalledWith('login', 'alice');
    expect(loginFn).toHaveBeenCalledWith('alice');
  });

  it('通配符监听器不影响粘性事件（* 是旁路观察者，不算消费）', () => {
    const bus = new Emitter<TestEvents>();
    const wildcardFn = vi.fn();
    const lateFn = vi.fn();

    bus.on('*', wildcardFn);
    bus.emit('login', 'alice');

    bus.on('login', lateFn);

    expect(wildcardFn).toHaveBeenCalledWith('login', 'alice');
    expect(lateFn).toHaveBeenCalledWith('alice');
  });
});

// ==================== 粘性事件 ====================

describe('Emitter: 粘性事件', () => {
  it('晚注册的监听器应消费之前的粘性事件', () => {
    const bus = new Emitter<TestEvents>();

    bus.emit('login', 'alice');
    bus.emit('login', 'bob');

    const fn = vi.fn();
    bus.on('login', fn);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenCalledWith('alice');
    expect(fn).toHaveBeenCalledWith('bob');
  });

  it('粘性事件消费后不再重复触发', () => {
    const bus = new Emitter<TestEvents>();

    bus.emit('login', 'alice');

    const fn1 = vi.fn();
    bus.on('login', fn1);
    expect(fn1).toHaveBeenCalledTimes(1);

    const fn2 = vi.fn();
    bus.on('login', fn2);
    expect(fn2).not.toHaveBeenCalled();
  });

  it('有监听器时 emit 不产生粘性事件', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();

    bus.on('login', fn1);
    bus.emit('login', 'alice');

    const fn2 = vi.fn();
    bus.on('login', fn2);

    expect(fn2).not.toHaveBeenCalled();
  });
});

// ==================== 键控事件 Map ====================

describe('Emitter: 键控事件 (Map)', () => {
  it('emitMap 应触发对应 key 的监听器', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.onMap('login', 'room-1', fn);
    bus.emitMap('login', 'room-1', 'alice');

    expect(fn).toHaveBeenCalledWith('alice');
  });

  it('emitMap 不同 key 之间互不影响', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    bus.onMap('login', 'room-1', fn1);
    bus.onMap('login', 'room-2', fn2);
    bus.emitMap('login', 'room-1', 'alice');

    expect(fn1).toHaveBeenCalledWith('alice');
    expect(fn2).not.toHaveBeenCalled();
  });

  it('onMap 同一 key 可注册多个监听器', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    bus.onMap('login', 'room-1', fn1);
    bus.onMap('login', 'room-1', fn2);
    bus.emitMap('login', 'room-1', 'alice');

    expect(fn1).toHaveBeenCalledWith('alice');
    expect(fn2).toHaveBeenCalledWith('alice');
  });

  it('offMap 应移除指定 key 的指定监听器', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    bus.onMap('login', 'room-1', fn1);
    bus.onMap('login', 'room-1', fn2);
    bus.offMap('login', 'room-1', fn1);
    bus.emitMap('login', 'room-1', 'alice');

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith('alice');
  });

  it('offMap 最后一个监听器时应清理空 Map', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.onMap('login', 'room-1', fn);
    bus.offMap('login', 'room-1', fn);
    bus.emitMap('login', 'room-1', 'alice');

    expect(fn).not.toHaveBeenCalled();
  });

  it('offMap 只有一个监听器时传入别的函数，不应误删它', () => {
    const bus = new Emitter<TestEvents>();
    const keep = vi.fn();
    const other = vi.fn();

    bus.onMap('login', 'room-1', keep);
    bus.offMap('login', 'room-1', other);
    bus.emitMap('login', 'room-1', 'alice');

    expect(keep).toHaveBeenCalledWith('alice');
  });

  it('offMap 对不存在的事件/key 不报错', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    expect(() => bus.offMap('login', 'nope', fn)).not.toThrow();
  });

  it('offMap 对已存在事件但不存在的 key 不报错', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();

    bus.onMap('login', 'room-1', fn);
    expect(() => bus.offMap('login', 'room-999', fn)).not.toThrow();
  });

  it('offMap 删除 key 后事件下仍有其它 key 不应清除事件 Map', () => {
    const bus = new Emitter<TestEvents>();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    bus.onMap('login', 'room-1', fn1);
    bus.onMap('login', 'room-2', fn2);
    bus.offMap('login', 'room-1', fn1);

    bus.emitMap('login', 'room-1', 'alice');
    bus.emitMap('login', 'room-2', 'bob');

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledWith('bob');
  });

  it('emitMap 对不存在的事件不报错', () => {
    const bus = new Emitter<TestEvents>();
    expect(() => bus.emitMap('login', 'nope', 'alice')).not.toThrow();
  });
});

// ==================== offAll ====================

describe('Emitter: offAll', () => {
  it('offAll 应清除所有事件、粘性事件和键控事件', () => {
    const bus = new Emitter<TestEvents>();
    const fn = vi.fn();
    const mapFn = vi.fn();

    bus.on('login', fn);
    bus.onMap('login', 'room-1', mapFn);
    bus.emit('data', { id: 1 });

    bus.offAll();

    bus.emit('login', 'alice');
    bus.emitMap('login', 'room-1', 'bob');

    const lateFn = vi.fn();
    bus.on('data', lateFn);

    expect(fn).not.toHaveBeenCalled();
    expect(mapFn).not.toHaveBeenCalled();
    expect(lateFn).not.toHaveBeenCalled();
  });
});

// ==================== 粘性事件上限 ====================

describe('Emitter: 粘性事件上限', () => {
  it('超过 stickyLimit 后丢弃最早的粘性事件', () => {
    const bus = new Emitter<TestEvents>({ stickyLimit: 2 });

    bus.emit('login', 'a');
    bus.emit('login', 'b');
    bus.emit('login', 'c');

    const fn = vi.fn();
    bus.on('login', fn);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).not.toHaveBeenCalledWith('a');
    expect(fn).toHaveBeenCalledWith('b');
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('stickyLimit 为 0 时完全关闭粘性事件', () => {
    const bus = new Emitter<TestEvents>({ stickyLimit: 0 });

    bus.emit('login', 'alice');

    const fn = vi.fn();
    bus.on('login', fn);

    expect(fn).not.toHaveBeenCalled();
  });

  it('clearSticky 可按事件名或整体清空粘性缓存', () => {
    const bus = new Emitter<TestEvents>();

    bus.emit('login', 'alice');
    bus.clearSticky('login');

    const fn = vi.fn();
    bus.on('login', fn);
    expect(fn).not.toHaveBeenCalled();

    bus.emit('login', 'bob');
    bus.clearSticky();

    const fn2 = vi.fn();
    bus.on('login', fn2);
    expect(fn2).not.toHaveBeenCalled();
  });
});
