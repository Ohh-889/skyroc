import type { PickerOption } from '../picker/types';
import type { DatePickerColumnType, DatePickerFilter, DatePickerFormatter } from './types';

/**
 * 生成列所需的全部上下文。
 *
 * 收成一个对象而不是平铺参数：年 / 月 / 日三列的范围互相牵制（选了 2 月日列才知道是 28 还是 29 天）， 每个环节都要拿到同一份完整上下文，平铺下去参数列表会一路膨胀。
 */
interface DateColumnsContext {
  /** 列类型及其顺序 */
  columnsType: DatePickerColumnType[];

  /** 排除部分选项 */
  filter?: DatePickerFilter;

  /** 自定义选项显示 */
  formatter?: DatePickerFormatter;

  /** 可选的最大日期 */
  maxDate: Date;

  /** 可选的最小日期 */
  minDate: Date;

  /**
   * 缺列时的兜底日期。
   *
   * ColumnsType 允许不含 year（只显示月日），这时月份的上下界没法从选中值里读出来， 用这个日期的年份补位。
   */
  referenceDate: Date;

  /** 当前各列的选中值，级联范围由它决定 */
  values: string[];
}

/** 求初值时的上下文，比 DateColumnsContext 少了选中值，min / maxDate 也还没补默认 */
interface DateInitialOptions {
  /** 列类型及其顺序 */
  columnsType: DatePickerColumnType[];

  /** 排除部分选项 */
  filter?: DatePickerFilter;

  /** 自定义选项显示 */
  formatter?: DatePickerFormatter;

  /** 可选的最大日期，缺省时由 resolveDateBounds 补 */
  maxDate?: Date;

  /** 可选的最小日期，缺省时由 resolveDateBounds 补 */
  minDate?: Date;
}

/** 默认列顺序。写在模块级：放进组件的默认参数会每次渲染新建数组，让按依赖比较的 memo 恒失效 */
const DEFAULT_COLUMNS_TYPE: DatePickerColumnType[] = ['year', 'month', 'day'];

/** 不传 min / maxDate 时，默认往前后各放开的年数 */
const DEFAULT_YEAR_SPAN = 10;

/**
 * 钳位迭代的最大轮数。
 *
 * 年 → 月 → 日 逐级收窄，每轮至少定死一列，正常数据下轮数等于列数； 这个上限只防 filter 把各列挖成互相排斥时来回震荡。
 */
const MAX_RESOLVE_DEPTH = 5;

/** 补零成两位，年份多于两位时原样返回 */
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

/** 抹掉时分秒，只留日期部分 */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 以某个日期为基准平移若干年 */
function shiftYear(date: Date, offset: number): Date {
  return new Date(date.getFullYear() + offset, date.getMonth(), date.getDate());
}

/** 按基准日期填出各列的值 */
function toColumnValues(columnsType: DatePickerColumnType[], referenceDate: Date): string[] {
  return columnsType.map(type => {
    if (type === 'year') return padZero(referenceDate.getFullYear());
    if (type === 'month') return padZero(referenceDate.getMonth() + 1);

    return padZero(referenceDate.getDate());
  });
}

/** 逐列比较两组选中值 */
function isSameValues(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

/** 补上 min / maxDate 的缺省区间：基准日期往前后各放开 DEFAULT_YEAR_SPAN 年 */
function resolveDateBounds(referenceDate: Date, minDate?: Date, maxDate?: Date): { maxDate: Date; minDate: Date } {
  return {
    maxDate: maxDate ?? shiftYear(referenceDate, DEFAULT_YEAR_SPAN),
    minDate: minDate ?? shiftYear(referenceDate, -DEFAULT_YEAR_SPAN)
  };
}

/** 取某年某月的最后一天，闰年由 Date 自己算 */
function getMonthEndDay(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** 把数值夹进闭区间 */
function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** 读取某一列当前选中的数值；该列不存在或值非法时返回兜底值 */
function readColumnValue(context: DateColumnsContext, type: DatePickerColumnType, fallback: number): number {
  const index = context.columnsType.indexOf(type);

  if (index === -1) return fallback;

  const parsed = Number.parseInt(context.values[index] ?? '', 10);

  return Number.isNaN(parsed) ? fallback : parsed;
}

/** 年列的可选范围，直接由 min / maxDate 决定 */
function getYearRange(context: DateColumnsContext): [number, number] {
  return [context.minDate.getFullYear(), context.maxDate.getFullYear()];
}

/** 月列的可选范围：只有停在首尾年份上时才会被 min / maxDate 收窄 */
function getMonthRange(context: DateColumnsContext): [number, number] {
  const [minYear, maxYear] = getYearRange(context);
  const year = readColumnValue(context, 'year', clampNumber(context.referenceDate.getFullYear(), minYear, maxYear));

  return [
    year === minYear ? context.minDate.getMonth() + 1 : 1,
    year === maxYear ? context.maxDate.getMonth() + 1 : 12
  ];
}

/** 日列的可选范围：先按当月天数定上界，再看是否落在首尾月份上被收窄 */
function getDayRange(context: DateColumnsContext): [number, number] {
  const [minYear, maxYear] = getYearRange(context);
  const [minMonth, maxMonth] = getMonthRange(context);
  const year = readColumnValue(context, 'year', clampNumber(context.referenceDate.getFullYear(), minYear, maxYear));
  const month = readColumnValue(
    context,
    'month',
    clampNumber(context.referenceDate.getMonth() + 1, minMonth, maxMonth)
  );

  const isMinMonth = year === minYear && month === context.minDate.getMonth() + 1;
  const isMaxMonth = year === maxYear && month === context.maxDate.getMonth() + 1;

  return [
    isMinMonth ? context.minDate.getDate() : 1,
    isMaxMonth ? Math.min(context.maxDate.getDate(), getMonthEndDay(year, month)) : getMonthEndDay(year, month)
  ];
}

/** 按列类型取范围 */
function getColumnRange(type: DatePickerColumnType, context: DateColumnsContext): [number, number] {
  if (type === 'year') return getYearRange(context);
  if (type === 'month') return getMonthRange(context);

  return getDayRange(context);
}

/** 把一段连续数值展开成选项，再交给 formatter / filter 加工 */
function genOptions(range: [number, number], type: DatePickerColumnType, context: DateColumnsContext): PickerOption[] {
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
 * 渲染和 onChange 都走这一个入口：级联意味着「选中值变了列也要跟着变」， 两处各写一份迟早会在月末、年初这些边界上对不齐。
 */
function buildColumns(context: DateColumnsContext): PickerOption[][] {
  return context.columnsType.map(type => genOptions(getColumnRange(type, context), type, context));
}

/**
 * 把选中值钳回各列的可选范围内。
 *
 * 按数值比较而不是「取最后一项」：值小于下界时该收到第一项（2000 年在 2016–2036 里应当变成 2016）， 被 filter 挖空的中间值则取最接近的可选项。
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
 * 这两件事互相依赖：列的范围由选中值决定，而钳位后的值又会改变列的范围。算一轮不够—— 年被钳到首尾年份上之后，月列的上下界才该跟着收窄，日列还要再跟一轮。 只算一轮的话，min / maxDate 把初值排除在外时（比如
 * maxDate 在过去）， 首屏会给出一个越界日期，用户直接点确定就把它交出去了。
 */
function resolveDateColumns(context: DateColumnsContext): { columns: PickerOption[][]; values: string[] } {
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
 * 不传 defaultValue 时落在今天而不是区间开头；再按可选区间钳一遍—— min / maxDate 把今天排除在外时，开局就不该拿一个越界值去渲染。
 */
function resolveInitialValue(options: DateInitialOptions, defaultValue?: string[]): string[] {
  const referenceDate = startOfDay(new Date());
  const values =
    defaultValue && defaultValue.length > 0 ? defaultValue : toColumnValues(options.columnsType, referenceDate);

  return resolveDateColumns({
    ...options,
    ...resolveDateBounds(referenceDate, options.minDate, options.maxDate),
    referenceDate,
    values
  }).values;
}

export type { DateColumnsContext, DateInitialOptions };
export { DEFAULT_COLUMNS_TYPE, isSameValues, resolveDateBounds, resolveDateColumns, resolveInitialValue, startOfDay };
