import { act, renderHook } from '@testing-library/react';
import usePriorityQueue from '../src/use-priority-queue';

interface Task {
  /** 任务唯一标识 */
  id: string;

  /** 数值越大优先级越高 */
  priority: number;
}

const INITIAL_TASKS: Task[] = [
  { id: 'low', priority: 1 },
  { id: 'high', priority: 10 }
];

function createOptions(initialItems: readonly Task[] = INITIAL_TASKS) {
  return {
    compare: (a: Task, b: Task) => b.priority - a.priority,
    getId: (item: Task) => item.id,
    initialItems
  };
}

describe('usePriorityQueue', () => {
  it('返回排好序的初始快照和稳定的队列实例', () => {
    const { rerender, result } = renderHook(() => usePriorityQueue(createOptions()));
    const queue = result.current[1];

    expect(result.current[0].map(item => item.id)).toEqual(['high', 'low']);

    rerender();

    expect(result.current[1]).toBe(queue);
  });

  it('队列写操作会同步更新 React 快照', () => {
    const { result } = renderHook(() => usePriorityQueue(createOptions()));

    act(() => {
      result.current[1].enqueue({ id: 'urgent', priority: 100 });
    });

    expect(result.current[0].map(item => item.id)).toEqual(['urgent', 'high', 'low']);

    act(() => {
      result.current[1].update('low', task => ({ ...task, priority: 20 }));
    });

    expect(result.current[0].map(item => item.id)).toEqual(['urgent', 'low', 'high']);

    act(() => {
      result.current[1].dequeue();
    });

    expect(result.current[0].map(item => item.id)).toEqual(['low', 'high']);
  });

  it('遵守队列容量限制', () => {
    const { result } = renderHook(() => usePriorityQueue({ ...createOptions(), capacity: 2 }));

    act(() => {
      result.current[1].enqueue({ id: 'middle', priority: 5 });
    });

    expect(result.current[0].map(item => item.id)).toEqual(['high', 'middle']);
  });
});
