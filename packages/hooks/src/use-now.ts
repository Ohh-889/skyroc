import { useCreation } from 'ahooks';
import { useEffect } from 'react';
import { Store, useStore } from './store';

/**
 * 当前时间状态引擎
 *
 * 管理定时器生命周期和时间状态更新， 外部通过 useNow hook 桥接 React 渲染。
 */
class NowStore extends Store<Date> {
  /** 定时器 ID */
  private timerId: ReturnType<typeof setInterval> | null = null;

  /** 更新间隔（毫秒） */
  private readonly interval: number;

  constructor(interval: number) {
    super(new Date());
    this.interval = interval;
  }

  /** 暂停计时（箭头函数保证 this 绑定） */
  pause = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  };

  /** 恢复计时（箭头函数保证 this 绑定） */
  resume = () => {
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        this.setState(new Date());
      }, this.interval);
    }
  };
}

interface UseNowOptions {
  /** 是否在初始化时立即开始计时，默认 true */
  immediate?: boolean;

  /** 更新间隔（毫秒），默认 1000 */
  interval?: number;
}

/**
 * 当前时间 hook
 *
 * Class 管逻辑（NowStore），Hook 管渲染（useStore）。
 *
 * @param options - 配置项
 */
export function useNow(options: UseNowOptions = {}) {
  const { immediate = true, interval = 1000 } = options;

  const store = useCreation(() => new NowStore(interval), []);

  const now = useStore(store);

  useEffect(() => {
    if (immediate) {
      store.resume();
    }

    return () => store.pause();
  }, [store, immediate]);

  return { now, pause: store.pause, resume: store.resume };
}
