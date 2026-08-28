import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEffect, useMemo } from 'react';
import { PickerView } from '../picker/PickerView';
import type { DatePickerViewProps } from './types';
import {
  DEFAULT_COLUMNS_TYPE,
  isSameValues,
  resolveDateBounds,
  resolveDateColumns,
  resolveInitialValue,
  startOfDay
} from './utils';

/** 内联日期选择器，把年月日的级联范围算好后交给 PickerView 渲染 */
const DatePickerView = (props: DatePickerViewProps) => {
  const {
    columnsType = DEFAULT_COLUMNS_TYPE,
    defaultValue,
    filter,
    formatter,
    maxDate,
    minDate,
    onChange,
    value: valueProp,
    ...pickerProps
  } = props;

  // defaultProp 只在挂载时被读一次，这里每次渲染重算不会影响已有选中值。
  // 初值同样要过一遍钳位：min / maxDate 把今天排除在外时，开局就不该拿一个越界值去渲染
  const [value, setValue] = useControllableState({
    caller: 'DatePickerView',
    defaultProp: resolveInitialValue({ columnsType, filter, formatter, maxDate, minDate }, defaultValue),
    onChange,
    prop: valueProp
  });

  /**
   * 三个基准时间戳。
   *
   * 全部抹到零点再取 getTime()：同一天内多次渲染拿到的是同一个数字，下面的 memo 才有稳定依赖可比。 直接传 Date 对象的话，min / maxDate 缺省时每次渲染都是新对象，memo 等于没做。
   */
  const referenceTime = startOfDay(new Date()).getTime();
  const bounds = resolveDateBounds(new Date(referenceTime), minDate, maxDate);
  const minTime = bounds.minDate.getTime();
  const maxTime = bounds.maxDate.getTime();

  // 除选中值以外的上下文。单独 memo 出来，下面两处才有一份稳定的依赖可比
  const contextBase = useMemo(
    () => ({
      columnsType,
      filter,
      formatter,
      maxDate: new Date(maxTime),
      minDate: new Date(minTime),
      referenceDate: new Date(referenceTime)
    }),
    [columnsType, filter, formatter, maxTime, minTime, referenceTime]
  );

  // 列与选中值互相牵制，交给 resolveDateColumns 一次算到不动点。
  // 顺带把列的身份稳住：PickerColumn 内部有按 options 同步滚动位置的 effect，
  // 每次渲染都换一份新数组会让滚轮在用户滚动过程中被反复归位
  const resolved = useMemo(() => resolveDateColumns({ ...contextBase, values: value }), [contextBase, value]);

  function handleChange(nextValues: string[]) {
    // 改一列会改变后面几列的可选范围（换个月份日数就变），必须拿新值重算一遍列再钳位，
    // 否则是把上一轮的旧范围套在新值上
    setValue(resolveDateColumns({ ...contextBase, values: nextValues }).values);
  }

  // 钳位结果必须回流成状态：只拿它渲染的话，受控父组件手里会一直是那个越界的原值，
  // 屏幕显示与外部状态静默分叉。父组件不接这次修正时 value 不变、依赖也不变，不会来回震荡
  useEffect(() => {
    if (isSameValues(value, resolved.values)) return;

    setValue(resolved.values);
  }, [value, resolved, setValue]);

  return (
    <PickerView
      {...pickerProps}
      columns={resolved.columns}
      value={resolved.values}
      onChange={handleChange}
    />
  );
};

export { DatePickerView };
