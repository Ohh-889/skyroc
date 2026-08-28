// oxlint-disable unicorn/no-array-sort
/**
 * PriorityQueue<T> — 泛型优先级队列
 *
 * 核心能力：
 *
 * 1. ID 去重 — 同一 id 不会重复入队
 * 2. 优先级排序 — 由外部注入 compare 函数，队列始终有序
 * 3. 原地更新 — update / updateBy 改已入队的项，不用 remove 再 enqueue
 * 4. 容量上限 — 可选 capacity，排序后裁掉末尾
 * 5. 变更订阅 — subscribe 返回 unsubscribe（Zustand 惯例）
 *
 * 命名借鉴：
 *
 * - Enqueue / dequeue — @datastructures-js/priority-queue
 * - Peek — Java PriorityQueue / Mnemonist Heap
 * - Remove / removeBy — @datastructures-js v6 remove(cb)
 * - Subscribe → () => void — Zustand / Jotai store.sub
 *
 * 内部结构：
 *
 * - Map<string, T> 存储（O(1) 去重 / 查找 / 删除）
 * - Sorted T[] 缓存，仅写操作时重建
 *
 * ⚠️ 复杂度（重要，别被 "PriorityQueue" 这个名字误导）：
 *
 * 它不是二叉堆。每次写操作都会对全量元素重排一次：
 *
 * - `enqueue` / `remove` / `update`：O(n log n)
 * - `enqueueMany` / `removeBy` / `updateBy`：整批只排一次，O(n log n)
 * - `peek` / `get` / `has` / `toArray`：O(1)
 *
 * 也就是说逐条插入 n 个元素是 O(n² log n)。适用场景是 **读多写少、n 较小** （通知中心、Banner 队列这类几十条量级）；高频入队请批量调用 `enqueueMany`， 或换成真正的堆实现。
 *
 * @example
 *   ```ts
 *   type Task = { taskId: string; priority: number; createdAt: number };
 *
 *   const q = new PriorityQueue<Task>({
 *     getId: t => t.taskId,
 *     compare: (a, b) => a.priority - b.priority || b.createdAt - a.createdAt
 *   });
 *
 *   q.enqueue({ taskId: '1', priority: 0, createdAt: Date.now() });
 *   q.peek(); // highest-priority item
 *   q.toArray(); // full sorted snapshot
 *   ```;
 */

// ==================== Types ====================

/**
 * 队列配置
 *
 * 只需两个纯函数即可驱动整个队列，不对 T 的形状做任何假设。
 */
export type QueueConfig<T> = {
  /**
   * 队列容量上限，超出时丢弃排序后最末尾的那些
   *
   * 裁剪必须发生在排序之后（丢的是优先级最低的），所以放在队列里做而不是交给调用方 —— 外面做要多一轮排序和通知。 不传表示不限。
   */
  capacity?: number;

  /**
   * 排序比较器
   *
   * 遵循 Array.prototype.sort 惯例： 返回负数 → a 排在 b 前面（优先级更高） 返回正数 → b 排在 a 前面 返回 0 → 保持原序
   */
  compare: (a: T, b: T) => number;

  /**
   * 从 item 中提取唯一标识
   *
   * 用于入队去重（同 id 不重复）和定向移除。
   */
  getId: (item: T) => string;
};

type Listener<T> = (queue: readonly T[]) => void;

// ==================== PriorityQueue ====================

export class PriorityQueue<T> {
  private readonly getId: (item: T) => string;
  private readonly compare: (a: T, b: T) => number;
  private capacity: number;

  /** 主存储：id → item，保证 O(1) 去重 / 查找 / 删除 */
  private readonly store = new Map<string, T>();

  /** 有序快照缓存，仅在写操作后重建 */
  private sorted: readonly T[] = [];

  /** 变更监听器集合 */
  private readonly listeners = new Set<Listener<T>>();

  constructor(config: QueueConfig<T>) {
    this.getId = config.getId;
    this.compare = config.compare;
    this.capacity = config.capacity ?? Number.POSITIVE_INFINITY;
  }

  // ─── Write ────────────────────────────────────────────

  /**
   * 入队单条
   *
   * 如果 id 已存在则跳过（幂等），返回是否实际入队。
   */
  enqueue(item: T): boolean {
    const id = this.getId(item);

    if (this.store.has(id)) return false;

    this.store.set(id, item);
    this.rebuild();

    return true;
  }

  /**
   * 批量入队
   *
   * 跳过已存在的 id，仅触发一次排序和通知。 返回实际入队数量。
   */
  enqueueMany(items: T[]): number {
    let added = 0;

    for (const item of items) {
      const id = this.getId(item);

      if (!this.store.has(id)) {
        this.store.set(id, item);
        added += 1;
      }
    }

    if (added > 0) this.rebuild();

    return added;
  }

  /**
   * 出队队首（最高优先级）
   *
   * 移除并返回当前优先级最高的 item。 队列为空时返回 undefined。
   */
  dequeue(): T | undefined {
    const first = this.sorted[0];

    if (!first) return undefined;

    this.store.delete(this.getId(first));
    this.rebuild();

    return first;
  }

  /**
   * 按 id 移除
   *
   * 返回是否找到并移除。
   */
  remove(id: string): boolean {
    if (!this.store.delete(id)) return false;

    this.rebuild();

    return true;
  }

  /**
   * 按条件批量移除
   *
   * 返回实际移除数量。仅在有移除时触发一次排序和通知。
   *
   * @example
   *   // 移除所有 reference_type === 'health_alert' 的项
   *   queue.removeBy(item => item.reference_type === 'health_alert');
   */
  removeBy(predicate: (item: T) => boolean): number {
    let removed = 0;

    for (const [id, item] of this.store) {
      if (predicate(item)) {
        this.store.delete(id);
        removed += 1;
      }
    }

    if (removed > 0) this.rebuild();

    return removed;
  }

  /**
   * 按 id 更新已入队的 item
   *
   * 返回是否真的改了。updater 要返回新对象，原样返回入参表示这次不用改 —— 那样不会排序也不会 通知，订阅方就不会为一次空更新白渲染一轮。
   *
   * 这是 enqueue 覆盖不了的场景：enqueue 遇到同 id 直接跳过（幂等），要改已有项只能走这里。 remove 再 enqueue 也能达到同样效果，但会通知两次，订阅方会看到中间那个「少了一条」的状态。
   */
  update(id: string, updater: (prev: T) => T): boolean {
    const prev = this.store.get(id);

    if (prev === undefined) return false;

    const next = updater(prev);

    if (next === prev) return false;

    this.store.set(id, next);
    this.rebuild();

    return true;
  }

  /**
   * 按条件批量更新
   *
   * 返回实际更新数量，判定规则同 update：updater 原样返回入参的那些不算改动。 仅在有改动时触发一次排序和通知。
   *
   * @example
   *   // 全部标记已读
   *   queue.updateBy(
   *     item => !item.read,
   *     item => ({ ...item, read: true })
   *   );
   */
  updateBy(predicate: (item: T) => boolean, updater: (prev: T) => T): number {
    let updated = 0;

    for (const [id, item] of this.store) {
      const next = predicate(item) ? updater(item) : item;

      if (next !== item) {
        this.store.set(id, next);
        updated += 1;
      }
    }

    if (updated > 0) this.rebuild();

    return updated;
  }

  /**
   * 改容量上限
   *
   * 调小之后立刻裁到新上限并通知，不必等下一次写操作 —— 否则「把上限从 99 改成 20」在用户眼里 是没生效。
   */
  setCapacity(capacity: number): void {
    if (this.capacity === capacity) return;

    this.capacity = capacity;

    if (this.store.size > capacity) this.rebuild();
  }

  /** 清空队列 */
  clear(): void {
    if (this.store.size === 0) return;

    this.store.clear();
    this.sorted = [];
    this.notify();
  }

  // ─── Read ─────────────────────────────────────────────

  /**
   * 查看队首（最高优先级），不移除
   *
   * 队列为空时返回 undefined。
   */
  peek(): T | undefined {
    return this.sorted[0];
  }

  /** 检查指定 id 是否在队列中 */
  has(id: string): boolean {
    return this.store.has(id);
  }

  /** 按 id 获取 item */
  get(id: string): T | undefined {
    return this.store.get(id);
  }

  /**
   * 返回完整有序队列的不可变快照
   *
   * 返回的数组是内部缓存的引用（readonly），不会每次调用都创建新数组。 如需修改请先 spread：[...queue.toArray()]
   */
  toArray(): readonly T[] {
    return this.sorted;
  }

  /** 队列中 item 数量 */
  get size(): number {
    return this.store.size;
  }

  /** 队列是否为空 */
  get isEmpty(): boolean {
    return this.store.size === 0;
  }

  // ─── Subscribe ────────────────────────────────────────

  /**
   * 注册变更监听器
   *
   * 每次写操作（enqueue / dequeue / remove / clear）后调用， 参数为当前完整有序队列（readonly 快照）。
   *
   * 返回取消订阅函数。
   *
   * @example
   *   const unsub = queue.subscribe(sorted => {
   *     globalStore.set(bannerQueueAtom, [...sorted]);
   *   });
   *   // 不再需要时
   *   unsub();
   */
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  // ─── Iterate ──────────────────────────────────────────

  /** 支持 for...of 遍历（按优先级顺序） */
  [Symbol.iterator](): Iterator<T> {
    return this.sorted[Symbol.iterator]();
  }

  // ─── Internal ─────────────────────────────────────────

  /** 重建有序缓存、裁掉超出容量的部分，再通知所有监听器 */
  private rebuild(): void {
    const sorted = [...this.store.values()].sort(this.compare);

    if (sorted.length > this.capacity) {
      for (const item of sorted.splice(this.capacity)) {
        this.store.delete(this.getId(item));
      }
    }

    this.sorted = sorted;
    this.notify();
  }

  /** 通知所有监听器 */
  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.sorted);
    }
  }
}
