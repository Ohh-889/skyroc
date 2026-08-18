/** 状态更新器类型 支持直接传值或传入 updater 函数 */
type StateUpdater<S> = S | ((prev: S) => S);

/**
 * 通用状态引擎基类
 *
 * 职责： - 状态保存与更新（统一入口） - 订阅 / 通知（Observer 模式） - 提供 `subscribe` + `getSnapshot` 给 `useSyncExternalStore`
 *
 * 设计原则： - 普通基类而非抽象类，保留最大灵活性 - 所有状态更新必须走 `setState`，禁止直接 `this.state = ...` - `emit` 私有，杜绝"忘记通知"的问题
 */
export class Store<S> {
  /** 当前状态 */
  protected state: S;

  /**
   * 订阅者集合。
   *
   * 用 `#` 而不是 `private`：`private` 只是编译期约束，运行时仍然是普通成员，子类写了同名 的 `listeners` / `emit` 会把基类这套悄悄顶掉。`#` 是真私有，子类怎么命名都撞不上。
   */
  #listeners = new Set<() => void>();

  constructor(initialState: S) {
    this.state = initialState;
  }

  /** 订阅状态变化（箭头函数保证 this 绑定） */
  subscribe = (listener: () => void) => {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  /** 获取当前状态快照（箭头函数保证 this 绑定） */
  getSnapshot = (): S => this.state;

  /**
   * 全量状态更新
   *
   * - 支持直接传值：`this.setState(nextState)`
   * - 支持 updater 函数：`this.setState(prev => newState)`
   * - Object.is 防止无意义更新
   *
   * 适用于任意状态类型（原始值、数组、对象）
   */
  protected setState(nextOrUpdater: StateUpdater<S>) {
    const next = typeof nextOrUpdater === 'function' ? (nextOrUpdater as (prev: S) => S)(this.state) : nextOrUpdater;

    if (Object.is(next, this.state)) return;

    this.state = next;
    this.#emit();
  }

  /**
   * 局部状态更新（仅适用于对象类型的状态）
   *
   * - 支持直接传 partial：`this.patchState({ count: 1 })`
   * - 支持 updater 函数：`this.patchState(prev => ({ count: prev.count + 1 }))`
   * - 自动与当前状态合并，只需传入要修改的字段
   */
  protected patchState(patch: Partial<S> | ((prev: S) => Partial<S>)) {
    const partial = typeof patch === 'function' ? patch(this.state) : patch;
    this.setState({ ...this.state, ...partial } as S);
  }

  /**
   * 清空所有订阅者。
   *
   * 给「一次性实例」用：连接类 Store 在 destroy 时要切断全部订阅，否则订阅方会被这个 已经废弃的实例一直持有。常驻单例（toast、portal 之类）用不上。
   */
  protected clearListeners() {
    this.#listeners.clear();
  }

  /** 通知所有订阅者 */
  #emit() {
    this.#listeners.forEach(l => l());
  }
}
