import type { ComponentProps } from 'react';
import type DateTimePicker from 'react-native-ui-datepicker';

/** 日历组件属性，透传 react-native-ui-datepicker 全部属性 */
type CalendarProps = ComponentProps<typeof DateTimePicker>;

export type { CalendarProps };
export type {
  CalendarComponents,
  CalendarDay,
  CalendarMode,
  CalendarMonth,
  CalendarWeek,
  CalendarYear,
  DateType
} from 'react-native-ui-datepicker';
