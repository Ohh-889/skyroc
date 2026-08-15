import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { CurrentTime } from './types';
import { parseTime } from './utils';

interface UseCountDownOptions {
  /** 是否启用毫秒级渲染 */
  millisecond?: boolean;
  /** 倒计时变化回调 */
  onChange?: (current: CurrentTime) => void;
  /** 倒计时结束回调 */
  onFinish?: () => void;
  /** 总时长（毫秒） */
  time: number;
}

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

/** 倒计时 hook */
function useCountDown(options: UseCountDownOptions) {
  const { millisecond = false, onChange, onFinish, time } = options;

  const [remain, setRemain] = useState(time);
  const remainRef = useRef(time);
  const endTimeRef = useRef(0);
  const countingRef = useRef(false);
  const rafIdRef = useRef(0);

  // 保持回调引用最新
  const onChangeRef = useRef(onChange);
  const onFinishRef = useRef(onFinish);
  onChangeRef.current = onChange;
  onFinishRef.current = onFinish;

  function getCurrentRemain() {
    return Math.max(endTimeRef.current - Date.now(), 0);
  }

  function updateRemain(value: number) {
    remainRef.current = value;
    setRemain(value);

    const current = parseTime(value);
    onChangeRef.current?.(current);

    if (value === 0) {
      pause();
      onFinishRef.current?.();
    }
  }

  function microTick() {
    rafIdRef.current = requestAnimationFrame(() => {
      if (countingRef.current) {
        updateRemain(getCurrentRemain());

        if (remainRef.current > 0) {
          microTick();
        }
      }
    });
  }

  function macroTick() {
    rafIdRef.current = requestAnimationFrame(() => {
      if (countingRef.current) {
        const currentRemain = getCurrentRemain();

        if (!isSameSecond(currentRemain, remainRef.current) || currentRemain === 0) {
          updateRemain(currentRemain);
        }

        if (remainRef.current > 0) {
          macroTick();
        }
      }
    });
  }

  function tick() {
    if (millisecond) {
      microTick();
    } else {
      macroTick();
    }
  }

  function start() {
    if (!countingRef.current) {
      endTimeRef.current = Date.now() + remainRef.current;
      countingRef.current = true;
      tick();
    }
  }

  function pause() {
    countingRef.current = false;
    cancelAnimationFrame(rafIdRef.current);
  }

  function reset(totalTime: number = time) {
    pause();
    remainRef.current = totalTime;
    setRemain(totalTime);
  }

  // 处理 AppState 变化（前后台切换）
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && countingRef.current) {
        // 从后台恢复，重新计算剩余时间并继续
        tick();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [millisecond]);

  // time prop 变化时重置
  useEffect(() => {
    remainRef.current = time;
    setRemain(time);
  }, [time]);

  // 卸载时清理
  useEffect(() => {
    return () => {
      pause();
    };
  }, []);

  const current = parseTime(remain);

  return { current, pause, reset, start };
}

export { useCountDown };
