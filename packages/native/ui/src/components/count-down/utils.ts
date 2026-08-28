import type { CurrentTime } from './types';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** 将毫秒数解析为时间对象 */
export function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return { days, hours, milliseconds, minutes, seconds, total: time };
}

/** 数字补零 */
function padZero(num: number, targetLength = 2): string {
  return `${num}`.padStart(targetLength, '0');
}

/**
 * 根据 format 格式化时间对象为字符串
 *
 * Format 里缺失的高位单位会向下累加到相邻的低位单位上，例如 format 为 `mm:ss` 时天与小时都并入分钟， 这样任何单一单位的格式（`ss`、`SSS`）都能表示完整时长而不丢时间。
 */
export function parseFormat(format: string, currentTime: CurrentTime): string {
  const { days } = currentTime;
  let { hours, milliseconds, minutes, seconds } = currentTime;
  let result = format;

  if (result.includes('DD')) {
    result = result.replace('DD', padZero(days));
  } else {
    hours += days * 24;
  }

  if (result.includes('HH')) {
    result = result.replace('HH', padZero(hours));
  } else {
    minutes += hours * 60;
  }

  if (result.includes('mm')) {
    result = result.replace('mm', padZero(minutes));
  } else {
    seconds += minutes * 60;
  }

  if (result.includes('ss')) {
    result = result.replace('ss', padZero(seconds));
  } else {
    milliseconds += seconds * 1000;
  }

  // SS 是百分秒、S 是十分秒，必须先做除法降精度再补零。
  // 截字符串只在 milliseconds ≤ 999 时才等价，而 format 不含 ss 时秒会并进来、轻易超过 999，
  // 那时截出来的是无意义的高位数字（65000ms 截成 "65"）。
  if (result.includes('SSS')) {
    return result.replace('SSS', padZero(milliseconds, 3));
  }

  if (result.includes('SS')) {
    return result.replace('SS', padZero(Math.floor(milliseconds / 10), 2));
  }

  if (result.includes('S')) {
    return result.replace('S', padZero(Math.floor(milliseconds / 100), 1));
  }

  return result;
}
