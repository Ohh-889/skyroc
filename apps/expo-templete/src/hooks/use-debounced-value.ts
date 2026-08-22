import { useEffect, useState } from 'react';

/** 默认防抖时长 */
const DEFAULT_DELAY = 300;

/**
 * 把高频变化的值延迟到停止变化之后再输出。
 *
 * 搜索框接列表时用它包一层关键词，再把结果丢进 `useInfiniteList` 的 params —— 每敲一个字都换 queryKey 的话，会连着打出一串很快作废的请求。
 */
export function useDebouncedValue<T>(value: T, delay: number = DEFAULT_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}
