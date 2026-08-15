import { cn } from '@skyroc/utils';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { RollingTextItem } from './RollingTextItem';
import type { RollingTextProps, RollingTextRef } from './types';

/** 数字模式下每列在起止数字之间额外空转的圈数 */
const CIRCLE_NUM = 2;

/** 相邻两列的默认启动间隔（毫秒） */
const DEFAULT_DELAY_STEP = 200;

/** 归一化数字入参：只接受非负整数，非法值退化为 0 */
function toSafeInt(value: number): number {
  if (!Number.isFinite(value)) return 0;

  return Math.abs(Math.trunc(value));
}

/** 把数字按位拆成定长字符数组，高位补 0 */
function toDigits(num: number, len: number): string[] {
  return String(num).padStart(len, '0').split('');
}

/** 数字模式：单列自起始数字空转 CIRCLE_NUM 圈后落到目标数字 */
function getFigureArr(startDigit: number, targetDigit: number): string[] {
  const arr: string[] = [];

  // 从 startDigit 到 9
  for (let i = startDigit; i <= 9; i += 1) {
    arr.push(String(i));
  }

  // 循环 CIRCLE_NUM 圈
  for (let c = 0; c < CIRCLE_NUM; c += 1) {
    for (let i = 0; i <= 9; i += 1) {
      arr.push(String(i));
    }
  }

  // 从 0 到 targetDigit
  for (let i = 0; i <= targetDigit; i += 1) {
    arr.push(String(i));
  }

  return arr;
}

/** 文本模式：取每一项的第 idx 个字符组成该列序列，缺位补空 */
function getTextArrByIdx(textList: string[], idx: number): string[] {
  return textList.map(text => text[idx] || '');
}

const RollingText = forwardRef<RollingTextRef, RollingTextProps>((props, ref) => {
  const {
    autoStart = true,
    className,
    delayStep = DEFAULT_DELAY_STEP,
    direction = 'down',
    duration = 2000,
    height = 40,
    startNum = 0,
    stopOrder = 'ltr',
    targetNum = 0,
    textClassName,
    textList = []
  } = props;

  /** 播放信号：0 为停在起始位置，每次 start 自增一次，让各列重新起跑 */
  const [runId, setRunId] = useState(0);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setRunId(0);
    },
    start: () => {
      setRunId(id => id + 1);
    }
  }));

  useEffect(() => {
    if (!autoStart) return;

    setRunId(id => id + 1);
  }, [autoStart]);

  /** 内置类与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn('flex-row items-center', className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 各列同速不同步，ltr 时左列先起跑也先停 */
  function getDelay(index: number, len: number): number {
    return stopOrder === 'ltr' ? delayStep * index : delayStep * (len - 1 - index);
  }

  function getColumns(): { delay: number; figureArr: string[] }[] {
    // 文本模式：各项长度可能不等，列数取最长的一项，短项在多出的列上留空
    if (textList.length > 0) {
      const len = Math.max(...textList.map(text => text.length));

      return Array.from({ length: len }, (_, index) => ({
        delay: getDelay(index, len),
        figureArr: getTextArrByIdx(textList, index)
      }));
    }

    const start = toSafeInt(startNum);
    const target = toSafeInt(targetNum);
    const len = Math.max(String(start).length, String(target).length);
    const startDigits = toDigits(start, len);
    const targetDigits = toDigits(target, len);

    return Array.from({ length: len }, (_, index) => ({
      delay: getDelay(index, len),
      figureArr: getFigureArr(Number(startDigits[index]), Number(targetDigits[index]))
    }));
  }

  const columns = getColumns();

  return (
    <View className={slotClassNames.root}>
      {columns.map((column, index) => (
        // key 带上列数：位数变化时整排重建，不会复用到按旧行高定位的动画值
        <RollingTextItem
          key={`${columns.length}-${index}`}
          delay={column.delay}
          direction={direction}
          duration={duration}
          figureArr={column.figureArr}
          height={height}
          runId={runId}
          textClassName={textClassName}
        />
      ))}
    </View>
  );
});

RollingText.displayName = 'RollingText';

export { RollingText };
