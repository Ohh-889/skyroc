import { PriorityQueue } from '@skyroc/utils';
import type { QueueConfig } from '@skyroc/utils';
import { useCreation } from 'ahooks';
import { useStore } from './store';

interface PriorityQueueAdapterOptions<T> {
  /** 队列初始化配置 */
  config: QueueConfig<T>;

  /** 首次创建队列时写入的初始内容 */
  initialItems?: readonly T[];
}

/**
 * 将 PriorityQueue 适配为 useStore 可消费的订阅对象。
 *
 * 适配器不保存额外状态，PriorityQueue 始终是唯一数据源。
 */
class PriorityQueueAdapter<T> {
  /** 实际优先级队列实例 */
  readonly queue: PriorityQueue<T>;

  constructor(options: PriorityQueueAdapterOptions<T>) {
    const { config, initialItems = [] } = options;

    this.queue = new PriorityQueue(config);
    this.queue.enqueueMany([...initialItems]);
  }

  /** 获取当前有序队列快照 */
  getSnapshot = (): readonly T[] => {
    return this.queue.toArray();
  };

  /** 订阅队列变化 */
  subscribe = (listener: () => void) => {
    return this.queue.subscribe(listener);
  };
}

export interface UsePriorityQueueOptions<T> extends QueueConfig<T> {
  /** 首次创建队列时写入的初始内容 */
  initialItems?: readonly T[];
}

export type UsePriorityQueueReturn<T> = readonly [items: readonly T[], queue: PriorityQueue<T>];

/**
 * 响应式优先级队列 hook
 *
 * PriorityQueue 管理队列逻辑，hook 只负责创建实例并桥接 React 渲染。 配置和初始内容仅在首次渲染时生效。
 *
 * @param options - 队列配置和初始内容
 * @returns 当前有序快照和稳定的队列实例
 */
export default function usePriorityQueue<T>(options: UsePriorityQueueOptions<T>): UsePriorityQueueReturn<T> {
  const { capacity, compare, getId, initialItems } = options;

  const adapter = useCreation(
    () =>
      new PriorityQueueAdapter({
        config: { capacity, compare, getId },
        initialItems
      }),
    []
  );

  const items = useStore(adapter);

  return [items, adapter.queue];
}
