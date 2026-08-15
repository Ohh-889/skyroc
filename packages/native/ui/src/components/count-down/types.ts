import type { ReactNode } from 'react';

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
  /** 是否自动开始倒计时 */
  autoStart?: boolean;

  /** 自定义渲染函数，传入当前时间对象 */
  children?: (current: CurrentTime) => ReactNode;

  /** 自定义容器 className */
  className?: string;

  /** 时间格式，支持 DD/HH/mm/ss/S/SS/SSS */
  format?: string;

  /** 是否启用毫秒级渲染 */
  millisecond?: boolean;

  /** 倒计时变化回调，每次更新时触发 */
  onChange?: (current: CurrentTime) => void;

  /** 倒计时结束回调 */
  onFinish?: () => void;

  /** 倒计时总时长（毫秒） */
  time?: number;
}

/** CountDown 暴露方法 */
export interface CountDownRef {
  /** 暂停倒计时 */
  pause: () => void;
  /** 重置倒计时 */
  reset: () => void;
  /** 开始倒计时 */
  start: () => void;
}
