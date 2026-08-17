import type { ReactNode, Ref } from 'react';
import type { SlotClassNames } from '../../types';

/** CountDown 可覆盖的 slot 名称 */
export type CountDownSlots = 'root' | 'text';

/** 倒计时时间对象 */
export interface CurrentTime {
  /** 天数 */
  days: number;
  /** 小时（0-23） */
  hours: number;
  /** 毫秒（0-999） */
  milliseconds: number;
  /** 分钟（0-59） */
  minutes: number;
  /** 秒（0-59） */
  seconds: number;
  /** 总剩余毫秒 */
  total: number;
}

/** CountDown 组件属性 */
export interface CountDownProps {
  /** 是否自动开始倒计时，同时决定 ref.reset() 之后是否自动重新开始 */
  autoStart?: boolean;

  /** 自定义渲染函数，传入当前时间对象；仍然渲染在根容器内，className / classNames.root 照常生效 */
  children?: (current: CurrentTime) => ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名；children 接管渲染时 text slot 不再生效 */
  classNames?: SlotClassNames<CountDownSlots>;

  /** 时间格式，支持 DD/HH/mm/ss/S/SS/SSS */
  format?: string;

  /**
   * 是否启用毫秒级渲染
   *
   * 代价是每帧都要 setState 重渲染（约 60 次/秒），只在确实需要毫秒精度时开启； 关闭时内部只在跨秒的那一帧更新，空转的帧不会触发渲染。
   */
  millisecond?: boolean;

  /** 倒计时变化回调，每次更新时触发 */
  onChange?: (current: CurrentTime) => void;

  /** 倒计时结束回调 */
  onFinish?: () => void;

  /** 命令式控制的 ref，用于 start / pause / reset */
  ref?: Ref<CountDownRef>;

  /** 倒计时总时长（毫秒），计时过程中改变会按新时长重新开始 */
  time?: number;
}

/** CountDown 暴露方法 */
export interface CountDownRef {
  /** 暂停倒计时 */
  pause: () => void;
  /** 重置倒计时，不传则回到 time prop 的时长；autoStart 为 true 时会自动重新开始 */
  reset: (totalTime?: number) => void;
  /** 开始倒计时 */
  start: () => void;
}
