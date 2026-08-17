import type { Ref } from 'react';
import type { SlotClassNames } from '../../types';

/** 滚动方向 */
export type RollingTextDirection = 'down' | 'up';

/** 停止顺序 */
export type RollingTextStopOrder = 'ltr' | 'rtl';

/** RollingText 可覆盖的 slot 名称 */
export type RollingTextSlots = 'root' | 'text';

/** 数字模式与文本模式共有的属性 */
interface RollingTextBaseProps {
  /** 挂载后是否立即播放一次，同时决定 ref.reset() 之后是否自动重新开始 */
  autoStart?: boolean;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<RollingTextSlots>;

  /** 相邻两列的启动间隔（毫秒），与 stopOrder 共同决定错落效果 */
  delayStep?: number;

  /** 滚动方向 */
  direction?: RollingTextDirection;

  /** 单列的滚动时长（毫秒），不含 delayStep 带来的错峰耗时；各列共用同一时长，序列长的列因而滚得更快 */
  duration?: number;

  /** 每个字符所占的行高，字符的 lineHeight 跟随此值 */
  height?: number;

  /** 最后一列落定时触发一次；被下一轮播放打断则不触发 */
  onFinish?: () => void;

  /** 命令式控制的 ref，用于 start / reset */
  ref?: Ref<RollingTextRef>;

  /** 停止顺序，ltr 为左列先停 */
  stopOrder?: RollingTextStopOrder;
}

/** 数字模式：在两个数字之间逐位滚动 */
export interface RollingTextNumberProps extends RollingTextBaseProps {
  /** 每列在起止数字之间额外空转的圈数，超过 10 圈按 10 圈处理 */
  circles?: number;

  /** 首次播放的起点；此后每次 targetNum 变化都以上一次的 targetNum 为起点，不会闪回这里 */
  startNum?: number;

  /** 目标数字，列数由它的位数决定；负数取绝对值、小数向零取整、超过 MAX_SAFE_INTEGER 按 MAX_SAFE_INTEGER 处理 */
  targetNum: number;

  /** 数字模式下不可用 */
  textList?: never;
}

/** 文本模式：在给定的文本之间逐字符滚动 */
export interface RollingTextTextProps extends RollingTextBaseProps {
  /** 文本模式下不可用 */
  circles?: never;

  /** 文本模式下不可用 */
  startNum?: never;

  /** 文本模式下不可用 */
  targetNum?: never;

  /** 依次滚过的文本，首项为起始态、末项为最终态；列数取最长一项，短项在多出的列上留空 */
  textList: string[];
}

/** RollingText 组件属性，两种模式二选一 */
export type RollingTextProps = RollingTextNumberProps | RollingTextTextProps;

/** RollingText 暴露方法 */
export interface RollingTextRef {
  /** 回到起始位置，autoStart 为 true 时立即重播，为 false 时停在起始位置 */
  reset: () => void;

  /** 从起始位置播放一次，播放中调用会立即重播 */
  start: () => void;
}

/** 一轮播放的起止与播放信号，数字模式下 from / to 才有意义 */
export interface RollingTextRun {
  /** 本轮起点，首轮为 startNum，之后为上一轮的 to */
  from: number;

  /** 播放信号，0 为停在起始位置，每次自增触发一次重播 */
  id: number;

  /** 本轮终点 */
  to: number;
}

/** 单列的滚动数据 */
export interface RollingTextColumn {
  /** 该列自起始字符到目标字符的完整序列 */
  chars: string[];

  /** 该列的启动延迟（毫秒） */
  delay: number;
}

/** RollingTextItem 属性 */
export interface RollingTextItemProps {
  /** 该列自起始字符到目标字符的完整序列 */
  chars: string[];

  /** 该列的启动延迟（毫秒） */
  delay: number;

  /** 滚动方向 */
  direction: RollingTextDirection;

  /** 滚动时长（毫秒） */
  duration: number;

  /** 每个字符所占的行高 */
  height: number;

  /** 该列落定时的回调，只有最后停的那一列会拿到 */
  onFinish?: () => void;

  /** 播放信号，0 为停在起始位置，每次自增触发一次重播 */
  runId: number;

  /** 字符 slot 的最终类名，由父组件统一解析 */
  textClassName?: string;
}
