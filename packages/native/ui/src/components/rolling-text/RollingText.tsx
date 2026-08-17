import { cn } from '@skyroc/utils';
import { useEffect, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { RollingTextItem } from './RollingTextItem';
import type { RollingTextColumn, RollingTextProps, RollingTextRun } from './types';

/** 数字模式下每列在起止数字之间额外空转的默认圈数 */
const DEFAULT_CIRCLES = 2;

/** 空转圈数上限：一圈就是 10 个节点，再多单列的节点数会失控 */
const MAX_CIRCLES = 10;

/** 相邻两列的默认启动间隔（毫秒） */
const DEFAULT_DELAY_STEP = 200;

/**
 * 归一化数字入参：非法值退化为 0，负数取绝对值、小数向零取整。
 *
 * 必须夹到安全整数以内——1e21 这类值 String 出来是 "1e+21"，逐位拆开会得到 'e'、'+'， 拿去 Number() 是 NaN，会静默滚出一列错误内容。
 */
function toSafeInt(value: number): number {
  if (!Number.isFinite(value)) return 0;

  return Math.min(Math.abs(Math.trunc(value)), Number.MAX_SAFE_INTEGER);
}

/** 归一化圈数：非法值退化为默认圈数，并夹在 0 ~ MAX_CIRCLES 之间 */
function toSafeCircles(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_CIRCLES;

  return Math.min(Math.max(Math.trunc(value), 0), MAX_CIRCLES);
}

/** 把数字按位拆成定长字符数组，高位补 0、超出的高位截断 */
function toDigits(num: number, len: number): string[] {
  return String(num).padStart(len, '0').slice(-len).split('');
}

/** 数字模式：单列自起始数字空转 circles 圈后落到目标数字 */
function getDigitSequence(startDigit: number, targetDigit: number, circles: number): string[] {
  const chars: string[] = [];

  // 从 startDigit 到 9
  for (let i = startDigit; i <= 9; i += 1) {
    chars.push(String(i));
  }

  // 循环 circles 圈
  for (let c = 0; c < circles; c += 1) {
    for (let i = 0; i <= 9; i += 1) {
      chars.push(String(i));
    }
  }

  // 从 0 到 targetDigit
  for (let i = 0; i <= targetDigit; i += 1) {
    chars.push(String(i));
  }

  return chars;
}

/** 文本模式：取每一项的第 index 个字符组成该列序列，缺位补空 */
function getTextSequence(textList: string[], index: number): string[] {
  return textList.map(text => text[index] || '');
}

const RollingText = (props: RollingTextProps) => {
  const {
    autoStart = true,
    circles = DEFAULT_CIRCLES,
    className,
    classNames,
    delayStep = DEFAULT_DELAY_STEP,
    direction = 'down',
    duration = 2000,
    height = 40,
    onFinish,
    ref,
    startNum = 0,
    stopOrder = 'ltr',
    targetNum = 0,
    textList
  } = props;

  const isTextMode = Boolean(textList?.length);

  const safeTarget = toSafeInt(targetNum);

  const [run, setRun] = useState<RollingTextRun>(() => ({ from: toSafeInt(startNum), id: 0, to: safeTarget }));

  /**
   * 目标值变化时以上一轮的终点作为新起点，接着往下滚，而不是闪回 startNum 再重来。
   *
   * 这是渲染期修正 props 派生 state 的标准写法：React 会丢弃本次渲染的输出并立即用新 state 重跑， 子组件不会看到中间态；条件保证了它不会自循环。还没播过时（autoStart=false 且没手动
   * start） 屏幕上停着的是 from 而不是 to，此时只换终点、不起跑。
   */
  if (!isTextMode && run.to !== safeTarget) {
    setRun(prev => (prev.id > 0 ? { from: prev.to, id: prev.id + 1, to: safeTarget } : { ...prev, to: safeTarget }));
  }

  useImperativeHandle(ref, () => ({
    reset: () => {
      // 与 CountDown 对齐：autoStart 同时决定 reset 之后是否自动重新开始
      setRun(prev => ({ ...prev, id: autoStart ? prev.id + 1 : 0 }));
    },
    start: () => {
      setRun(prev => ({ ...prev, id: prev.id + 1 }));
    }
  }));

  useEffect(() => {
    if (!autoStart) return;

    setRun(prev => ({ ...prev, id: prev.id + 1 }));
  }, [autoStart]);

  /** Slot 级与根级覆盖合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：内置样式 < slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      root: cn('flex-row items-center', classNames?.root, className),
      text: cn('text-lg font-medium text-foreground', classNames?.text)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 各列只错开起跑时间，不改时长；ltr 时左列先起跑也先停 */
  function getDelay(index: number, len: number): number {
    return stopOrder === 'ltr' ? delayStep * index : delayStep * (len - 1 - index);
  }

  function getColumns(): RollingTextColumn[] {
    // 文本模式：各项长度可能不等，列数取最长的一项，短项在多出的列上留空
    if (textList && textList.length > 0) {
      const len = Math.max(...textList.map(text => text.length));

      return Array.from({ length: len }, (_, index) => ({
        chars: getTextSequence(textList, index),
        delay: getDelay(index, len)
      }));
    }

    // 列数只看目标值：起点位数更多时截掉高位，数值变短才不会留下一排前导零
    const len = String(run.to).length;
    const startDigits = toDigits(run.from, len);
    const targetDigits = toDigits(run.to, len);
    const safeCircles = toSafeCircles(circles);

    return Array.from({ length: len }, (_, index) => ({
      chars: getDigitSequence(Number(startDigits[index]), Number(targetDigits[index]), safeCircles),
      delay: getDelay(index, len)
    }));
  }

  const columns = getColumns();

  /** 停止顺序决定哪一列最后落定，只让它回调，避免每列各报一次 */
  const finishIndex = stopOrder === 'ltr' ? columns.length - 1 : 0;

  return (
    <View className={slotClassNames.root}>
      {columns.map((column, index) => (
        // key 带上列数：位数变化时整排重建，不会复用到按旧行高定位的动画值
        <RollingTextItem
          key={`${columns.length}-${index}`}
          chars={column.chars}
          delay={column.delay}
          direction={direction}
          duration={duration}
          height={height}
          runId={run.id}
          textClassName={slotClassNames.text}
          onFinish={index === finishIndex ? onFinish : undefined}
        />
      ))}
    </View>
  );
};

export { RollingText };
