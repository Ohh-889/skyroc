import type { ComponentProps } from 'react';
import type DateTimePicker from 'react-native-ui-datepicker';

/** 日历组件属性，透传 react-native-ui-datepicker 全部属性 */
type CalendarProps = ComponentProps<typeof DateTimePicker>;

/**
 * 各 slot 的类名映射。
 *
 * 第三方没把 ClassNames 从包根导出，只能从 props 的类型上取回来。
 */
type CalendarClassNames = NonNullable<CalendarProps['classNames']>;

export type {
  CalendarComponents,
  CalendarDay,
  CalendarMode,
  CalendarMonth,
  CalendarWeek,
  CalendarYear,
  DateType
} from 'react-native-ui-datepicker';
export type { CalendarClassNames, CalendarProps };
