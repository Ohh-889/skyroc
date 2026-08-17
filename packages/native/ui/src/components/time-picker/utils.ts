import type { PickerOption } from '../picker/types';
import type { TimePickerColumnType, TimePickerFilter, TimePickerFormatter } from './types';

/** 时分秒三段数值 */
export type TimeParts = [number, number, number];

/**
 * 生成列所需的全部上下文。
 *
 * 收成一个对象而不是平铺参数：时 / 分 / 秒三列的范围互相牵制（minTime 落在 10:30 时，
 * 只有停在 10 点上分列才从 30 起算），每个环节都要拿到同一份完整上下文，平铺下去参数列表会一路膨胀。
 */
interface TimeColumnsContext {
  /** 列类型及其顺序 */
  columnsType: TimePickerColumnType[];

  /** 排除部分选项 */
  filter?: TimePickerFilter;

  /** 自定义选项显示 */
  formatter?: TimePickerFormatter;

  /** 可选的最大时刻 */
  maxParts: TimeParts;

  /** 可选的最小时刻 */
  minParts: TimeParts;

  /**
   * 缺列时的兜底时刻。
   *
   * columnsType 允许不含 hour（只显示分秒），这时分列的上下界没法从选中值里读出来，
   * 用这个时刻的对应段补位。
   */
  referenceParts: TimeParts;

  /** 当前各列的选中值，级联范围由它决定 */
  values: string[];
}

/** 求初值时的上下文，比 TimeColumnsContext 少了选中值，min / maxTime 也还没补默认 */
interface TimeInitialOptions {
  /** 列类型及其顺序 */
  columnsType: TimePickerColumnType[];

  /** 排除部分选项 */
  filter?: TimePickerFilter;

  /** 自定义选项显示 */
  formatter?: TimePickerFormatter;

  /** 可选的最大时刻，缺省时由 resolveTimeBounds 补 */
  maxTime?: string;

  /** 可选的最小时刻，缺省时由 resolveTimeBounds 补 */
  minTime?: string;
}

/** 默认列顺序。写在模块级：放进组件的默认参数会每次渲染新建数组，让按依赖比较的 memo 恒失效 */
const DEFAULT_COLUMNS_TYPE: TimePickerColumnType[] = ['hour', 'minute'];

/** 不传 minTime 时的下界 */
const DEFAULT_MIN_TIME = '00:00:00';

/** 不传 maxTime 时的上界 */
const DEFAULT_MAX_TIME = '23:59:59';

/** 各段的取值上限，按 [时, 分, 秒] 排列 */
const PART_MAX: TimeParts = [23, 59, 59];

/**
 * 钳位迭代的最大轮数。
 *
 * 时 → 分 → 秒 逐级收窄，每轮至少定死一列，正常数据下轮数等于列数；
 * 这个上限只防 filter 把各列挖成互相排斥时来回震荡。
 */
const MAX_RESOLVE_DEPTH = 5;

/** 补零成两位 */
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/** 把数值夹进闭区间 */
function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * 解析 "HH:mm:ss" 成三段数值。
 *
 * 缺省的段按 0 补（`"10"` 等于 `10:00:00`），非法段也落回 0 而不是抛错——
 * min / maxTime 是手写字符串，一个笔误不该把整个滚轮打空。每段还会夹回各自的合法上限。
 */
function parseTime(time: string): TimeParts {
  const segments = time.split(':');

  return PART_MAX.map((max, index) => {
    const parsed = Number.parseInt(segments[index] ?? '', 10);

    return Number.isNaN(parsed) ? 0 : clampNumber(parsed, 0, max);
  }) as TimeParts;
}

/** 拼回 "HH:mm:ss" */
function stringifyTime(parts: TimeParts): string {
  return parts.map(padZero).join(':');
}

/** 按时间先后比较两个时刻 */
function compareParts(left: TimeParts, right: TimeParts): number {
  for (let index = 0; index < left.length; index += 1) {
    const diff = left[index]! - right[index]!;

    if (diff !== 0) return diff;
  }

  return 0;
}

/** 取当前时刻的时分秒 */
function getCurrentTimeParts(): TimeParts {
  const now = new Date();

  return [now.getHours(), now.getMinutes(), now.getSeconds()];
}

/**
 * 补上 min / maxTime 的缺省值并归一化成 "HH:mm:ss"。
 *
 * 返回字符串而不是解析好的数组：调用方要拿它当 memo 依赖，数组每次都是新对象比不出相等。
 * 上界早于下界时退化成下界那一个时刻，而不是留下一个空区间——空列在滚轮上就是一片空白，
 * 比钳成一个点更难让人看出是参数传反了。
 */
function resolveTimeBounds(minTime?: string, maxTime?: string): { maxTime: string; minTime: string } {
  const minParts = parseTime(minTime ?? DEFAULT_MIN_TIME);
  const maxParts = parseTime(maxTime ?? DEFAULT_MAX_TIME);

  return {
    maxTime: stringifyTime(compareParts(maxParts, minParts) < 0 ? minParts : maxParts),
    minTime: stringifyTime(minParts)
  };
}

/** 按基准时刻填出各列的值 */
function toColumnValues(columnsType: TimePickerColumnType[], referenceParts: TimeParts): string[] {
  return columnsType.map(type => {
    if (type === 'hour') return padZero(referenceParts[0]);
    if (type === 'minute') return padZero(referenceParts[1]);

    return padZero(referenceParts[2]);
  });
}

/** 逐列比较两组选中值 */
function isSameValues(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

/** 读取某一列当前选中的数值；该列不存在或值非法时返回兜底值 */
function readColumnValue(context: TimeColumnsContext, type: TimePickerColumnType, fallback: number): number {
  const index = context.columnsType.indexOf(type);

  if (index === -1) return fallback;

  const parsed = Number.parseInt(context.values[index] ?? '', 10);

  return Number.isNaN(parsed) ? fallback : parsed;
}

/** 时列的可选范围，直接由 min / maxTime 决定 */
function getHourRange(context: TimeColumnsContext): [number, number] {
  return [context.minParts[0], context.maxParts[0]];
}

/** 分列的可选范围：只有停在首尾小时上时才会被 min / maxTime 收窄 */
function getMinuteRange(context: TimeColumnsContext): [number, number] {
  const [minHour, maxHour] = getHourRange(context);
  const hour = readColumnValue(context, 'hour', clampNumber(context.referenceParts[0], minHour, maxHour));

  return [hour === minHour ? context.minParts[1] : 0, hour === maxHour ? context.maxParts[1] : PART_MAX[1]];
}

/** 秒列的可选范围：只有时分同时停在首尾上时才会被收窄 */
function getSecondRange(context: TimeColumnsContext): [number, number] {
  const [minHour, maxHour] = getHourRange(context);
  const [minMinute, maxMinute] = getMinuteRange(context);
  const hour = readColumnValue(context, 'hour', clampNumber(context.referenceParts[0], minHour, maxHour));
  const minute = readColumnValue(context, 'minute', clampNumber(context.referenceParts[1], minMinute, maxMinute));

  const isMinMinute = hour === minHour && minute === context.minParts[1];
  const isMaxMinute = hour === maxHour && minute === context.maxParts[1];

  return [isMinMinute ? context.minParts[2] : 0, isMaxMinute ? context.maxParts[2] : PART_MAX[2]];
}

/** 按列类型取范围 */
function getColumnRange(type: TimePickerColumnType, context: TimeColumnsContext): [number, number] {
  if (type === 'hour') return getHourRange(context);
  if (type === 'minute') return getMinuteRange(context);

  return getSecondRange(context);
}

/** 把一段连续数值展开成选项，再交给 formatter / filter 加工 */
function genOptions(range: [number, number], type: TimePickerColumnType, context: TimeColumnsContext): PickerOption[] {
  const [min, max] = range;
  const options: PickerOption[] = [];

  for (let i = min; i <= max; i += 1) {
    const value = padZero(i);
    const option: PickerOption = { label: value, value };

    options.push(context.formatter ? context.formatter(type, option) : option);
  }

  return context.filter ? context.filter(type, options, context.values) : options;
}

/**
 * 由当前选中值推出各列选项。
 *
 * 渲染和 onChange 都走这一个入口：级联意味着「选中值变了列也要跟着变」，
 * 两处各写一份迟早会在首尾小时这些边界上对不齐。
 */
function buildColumns(context: TimeColumnsContext): PickerOption[][] {
  return context.columnsType.map(type => genOptions(getColumnRange(type, context), type, context));
}

/**
 * 把选中值钳回各列的可选范围内。
 *
 * 按数值比较而不是「取最后一项」：值小于下界时该收到第一项（minTime 是 10:00 时 08 点应当变成 10 点，
 * 而不是被弹到 23 点），被 filter 挖空的中间值则取最接近的可选项。
 */
function clampValues(values: string[], columns: PickerOption[][]): string[] {
  return columns.map((options, index) => {
    const value = values[index] ?? '';

    if (options.length === 0) return value;
    if (options.some(option => option.value === value)) return value;

    const target = Number.parseInt(value, 10);
    const first = options[0]!.value ?? value;

    if (Number.isNaN(target)) return first;

    let closest = first;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const option of options) {
      const distance = Math.abs(Number.parseInt(option.value ?? '', 10) - target);

      if (!Number.isNaN(distance) && distance < minDistance) {
        minDistance = distance;
        closest = option.value ?? value;
      }
    }

    return closest;
  });
}

/**
 * 归一化列数据并同时修正选中值，迭代到不动点。
 *
 * 这两件事互相依赖：列的范围由选中值决定，而钳位后的值又会改变列的范围。算一轮不够——
 * 时被钳到首尾小时上之后，分列的上下界才该跟着收窄，秒列还要再跟一轮。
 * 只算一轮的话，maxTime 是 10:30 而传进来 11:45 时，时会被钳成 10、分却还留着按 11 点算出的 45，
 * 首屏直接给出一个越界的 10:45。
 */
function resolveTimeColumns(context: TimeColumnsContext): { columns: PickerOption[][]; values: string[] } {
  let values = context.values;
  let columns = buildColumns(context);

  for (let depth = 0; depth < MAX_RESOLVE_DEPTH; depth += 1) {
    const nextValues = clampValues(values, columns);

    if (isSameValues(nextValues, values)) break;

    values = nextValues;
    columns = buildColumns({ ...context, values });
  }

  return { columns, values };
}

/**
 * 挂载时的初值。
 *
 * 不传 defaultValue 时落在当前时刻而不是区间开头；再按可选区间钳一遍——
 * min / maxTime 把此刻排除在外时，开局就不该拿一个越界值去渲染。
 *
 * referenceParts 可以由调用方传入：组件里已经为「缺列兜底」快照过一次当前时刻，
 * 传进来两处才是同一个基准，而不是差了几毫秒的两次读表。
 */
function resolveInitialValue(
  options: TimeInitialOptions,
  defaultValue?: string[],
  referenceParts: TimeParts = getCurrentTimeParts()
): string[] {
  const bounds = resolveTimeBounds(options.minTime, options.maxTime);
  const values =
    defaultValue && defaultValue.length > 0 ? defaultValue : toColumnValues(options.columnsType, referenceParts);

  return resolveTimeColumns({
    columnsType: options.columnsType,
    filter: options.filter,
    formatter: options.formatter,
    maxParts: parseTime(bounds.maxTime),
    minParts: parseTime(bounds.minTime),
    referenceParts,
    values
  }).values;
}

export type { TimeColumnsContext, TimeInitialOptions };
export {
  DEFAULT_COLUMNS_TYPE,
  getCurrentTimeParts,
  isSameValues,
  parseTime,
  resolveInitialValue,
  resolveTimeBounds,
  resolveTimeColumns
};
