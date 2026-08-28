import { useEffect, useRef } from 'react';

/** 长按多久后进入连续触发 */
const LONG_PRESS_DELAY = 600;

/** 连续触发的间隔 */
const LONG_PRESS_INTERVAL = 150;

/** 长按连续触发配置 */
interface UseLongPressOptions<T> {
  /** 关闭后 start 不再生效 */
  enabled: boolean;
  /** 连续触发的回调，通过 ref 取最新实现，长按期间外部状态变化即时生效 */
  onRepeat: (payload: T) => void;
}

/** 长按连续触发控制器 */
interface UseLongPressResult<T> {
  /** 本次 press 是否由长按补发；返回 true 表示应当吞掉，读取后自动复位 */
  consumeLongPress: () => boolean;
  /** Press-in 时开始计时 */
  start: (payload: T) => void;
  /** Press-out 或提前终止时调用 */
  stop: () => void;
}

/** 按住不放时按固定间隔重复触发，松手或卸载时自动清理定时器 */
function useLongPress<T>(options: UseLongPressOptions<T>): UseLongPressResult<T> {
  const { enabled, onRepeat } = options;

  const onRepeatRef = useRef(onRepeat);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLongPressRef = useRef(false);

  function stop() {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function start(payload: T) {
    if (!enabled) return;

    stop();
    isLongPressRef.current = false;

    delayTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      intervalRef.current = setInterval(() => {
        onRepeatRef.current(payload);
      }, LONG_PRESS_INTERVAL);
    }, LONG_PRESS_DELAY);
  }

  function consumeLongPress() {
    if (!isLongPressRef.current) return false;

    isLongPressRef.current = false;
    return true;
  }

  useEffect(() => {
    onRepeatRef.current = onRepeat;
  });

  useEffect(() => {
    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { consumeLongPress, start, stop };
}

export { useLongPress };
export type { UseLongPressOptions, UseLongPressResult };
