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
  let str = `${num}`;
  while (str.length < targetLength) {
    str = `0${str}`;
  }
  return str;
}

/** 根据 format 格式化时间对象为字符串 */
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

  if (result.includes('S')) {
    const ms = padZero(milliseconds, 3);
    if (result.includes('SSS')) {
      result = result.replace('SSS', ms);
    } else if (result.includes('SS')) {
      result = result.replace('SS', ms.slice(0, 2));
    } else {
      result = result.replace('S', ms.charAt(0));
    }
  }

  return result;
}
