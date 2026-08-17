// oxlint-disable eslint-plugin-react-hooks/exhaustive-deps
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { CurrentTime } from './types';
import { parseTime } from './utils';

interface UseCountDownOptions {
  /** 是否在挂载后自动开始，以及 reset 之后是否自动重新开始 */
  autoStart?: boolean;
  /** 是否启用毫秒级渲染，代价是每帧 setState 重渲染 */
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
  const { autoStart = true, millisecond = false, onChange, onFinish, time } = options;

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

  function pause() {
    countingRef.current = false;

    cancelAnimationFrame(rafIdRef.current);
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

  /** 毫秒级：每帧都 updateRemain，因而每帧都会 setState 重渲染（约 60 次/秒）——精度的代价 */
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

  /** 秒级：同样每帧醒来，但只在跨秒的那一帧才 updateRemain，空转的帧不触发渲染 */
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

  function reset(totalTime: number = time) {
    pause();
    remainRef.current = totalTime;
    setRemain(totalTime);

    if (autoStart) {
      start();
    }
  }

  // 处理 AppState 变化（前后台切换）
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && countingRef.current) {
        // 后台挂起的那帧回调会在回到前台时补发并继续递归，若直接 tick 会派生出第二条并行的
        // raf 链，而 rafIdRef 只存得下一个 id —— pause 将永远停不掉另一条。先取消再重启。
        cancelAnimationFrame(rafIdRef.current);
        tick();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [millisecond]);

  // time prop 变化时按新时长重置；正在计时的话用新时长重新开始
  // （只改 remainRef 不重置 endTimeRef 的话，下一帧就会被旧的 endTime 覆盖回去）
  useEffect(() => {
    const wasCounting = countingRef.current;

    pause();
    remainRef.current = time;
    setRemain(time);

    if (wasCounting) {
      start();
    }
  }, [time]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

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
