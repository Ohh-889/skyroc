import { useEffect, useRef } from 'react';

/**
 * 到点自动关闭
 *
 * OnTimeout 用 ref 承接而不是进依赖数组：调用方几乎必然传内联箭头函数，直接依赖会让每次渲染都重排定时器，倒计时永远归零。 代价是依赖数组只剩 active 与 delay 两个真实依赖，无需关闭
 * exhaustive-deps 检查。
 */
export function useAutoClose(active: boolean, delay: number, onTimeout: () => void) {
  const timeoutRef = useRef(onTimeout);

  useEffect(() => {
    timeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (!active || delay <= 0) return undefined;

    const timer = setTimeout(() => timeoutRef.current(), delay);

    return () => clearTimeout(timer);
  }, [active, delay]);
}
