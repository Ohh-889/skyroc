import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEffect, useMemo, useRef } from 'react';
import { PickerView } from '../picker/PickerView';
import type { TimePickerViewProps } from './types';
import type { TimeParts } from './utils';
import {
  DEFAULT_COLUMNS_TYPE,
  getCurrentTimeParts,
  isSameValues,
  parseTime,
  resolveInitialValue,
  resolveTimeBounds,
  resolveTimeColumns
} from './utils';

/** 内联时间选择器，把时分秒的级联范围算好后交给 PickerView 渲染 */
const TimePickerView = (props: TimePickerViewProps) => {
  const {
    columnsType = DEFAULT_COLUMNS_TYPE,
    defaultValue,
    filter,
    formatter,
    maxTime,
    minTime,
    onChange,
    value: valueProp,
    ...pickerProps
  } = props;

  // 缺列时的兜底时刻，挂载时快照一次，之后不再变。
  // 每次渲染重读 new Date() 的话秒一直在跳，下面按依赖比较的 memo 会每秒失效一次，
  // 列跟着换成新数组，用户正滚着的滚轮就被 PickerColumn 的同步 effect 反复归位
  const referencePartsRef = useRef<TimeParts | null>(null);
  referencePartsRef.current ??= getCurrentTimeParts();
  const referenceParts = referencePartsRef.current;

  // defaultProp 只在挂载时被读一次，这里每次渲染重算不会影响已有选中值。
  // 初值同样要过一遍钳位：min / maxTime 把此刻排除在外时，开局就不该拿一个越界值去渲染
  const [value, setValue] = useControllableState({
    caller: 'TimePickerView',
    defaultProp: resolveInitialValue(
      { columnsType, filter, formatter, maxTime, minTime },
      defaultValue,
      referenceParts
    ),
    onChange,
    prop: valueProp
  });

  // 归一化后的边界。往下传字符串而不是解析好的数组：数组每次渲染都是新对象，拿它当 memo 依赖等于没做
  const bounds = resolveTimeBounds(minTime, maxTime);

  // 除选中值以外的上下文。单独 memo 出来，下面两处才有一份稳定的依赖可比
  const contextBase = useMemo(
    () => ({
      columnsType,
      filter,
      formatter,
      maxParts: parseTime(bounds.maxTime),
      minParts: parseTime(bounds.minTime),
      referenceParts
    }),
    [columnsType, filter, formatter, bounds.maxTime, bounds.minTime, referenceParts]
  );

  // 列与选中值互相牵制，交给 resolveTimeColumns 一次算到不动点。
  // 顺带把列的身份稳住：PickerColumn 内部有按 options 同步滚动位置的 effect，
  // 每次渲染都换一份新数组会让滚轮在用户滚动过程中被反复归位
  const resolved = useMemo(() => resolveTimeColumns({ ...contextBase, values: value }), [contextBase, value]);

  function handleChange(nextValues: string[]) {
    // 改一列会改变后面几列的可选范围（时停到首尾小时上分列就要收窄），必须拿新值重算一遍列再钳位，
    // 否则是把上一轮的旧范围套在新值上
    setValue(resolveTimeColumns({ ...contextBase, values: nextValues }).values);
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

export { TimePickerView };
