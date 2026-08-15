import type { Ref } from 'react';

/** 滚动方向 */
export type RollingTextDirection = 'down' | 'up';

/** 停止顺序 */
export type RollingTextStopOrder = 'ltr' | 'rtl';

/** RollingText 组件属性 */
export interface RollingTextProps {
  /** 挂载后是否立即播放一次 */
  autoStart?: boolean;

  /** 自定义容器 className */
  className?: string;

  /** 相邻两列的启动间隔（毫秒），与 stopOrder 共同决定错落效果 */
  delayStep?: number;

  /** 滚动方向 */
  direction?: RollingTextDirection;

  /** 单列的滚动时长（毫秒），不含 delayStep 带来的错峰耗时 */
  duration?: number;

  /** 每个字符所占的行高 */
  height?: number;

  /** 命令式控制的 ref，用于 start / reset */
  ref?: Ref<RollingTextRef>;

  /** 起始数字，仅数字模式生效；负数取绝对值、小数向零取整 */
  startNum?: number;

  /** 停止顺序，ltr 为左列先停 */
  stopOrder?: RollingTextStopOrder;

  /** 目标数字，仅数字模式生效；负数取绝对值、小数向零取整 */
  targetNum?: number;

  /** 字符样式，用于让字号与 height 匹配 */
  textClassName?: string;

  /** 自定义文本列表，非空时进入文本模式并忽略 startNum / targetNum */
  textList?: string[];
}

/** RollingText 暴露方法 */
export interface RollingTextRef {
  /** 回到起始位置并停止，不会自动重播 */
  reset: () => void;

  /** 从起始位置播放一次，播放中调用会立即重播 */
  start: () => void;
}

/** RollingTextItem 属性 */
export interface RollingTextItemProps {
  /** 该列的启动延迟（毫秒） */
  delay: number;

  /** 滚动方向 */
  direction: RollingTextDirection;

  /** 滚动时长（毫秒） */
  duration: number;

  /** 该列自起始字符到目标字符的完整序列 */
  figureArr: string[];

  /** 每个字符所占的行高 */
  height: number;

  /** 播放信号，0 为停在起始位置，每次自增触发一次重播 */
  runId: number;

  /** 字符样式 */
  textClassName?: string;
}
