import { Calendar, Text } from '@skyroc/native-ui';
import type { CalendarComponents, CalendarDay, DateType } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { View } from 'react-native';

/** 示例统一从当天零点开始，避免时分秒影响边界判断 */
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

/** 按日期格状态返回完整类名，避免动态拼接导致 Uniwind 漏扫 */
function getDayLabelClassName(day: CalendarDay): string {
  if (day.isSelected) return 'text-sm font-semibold text-primary-foreground';
  if (day.isDisabled) return 'text-sm text-muted-foreground opacity-50';
  if (day.isToday) return 'text-sm font-semibold text-primary';

  return 'text-sm text-foreground';
}

/** 自定义日期格需要自行表达交互状态，完整类名可被 Uniwind 静态扫描 */
function getDayContainerClassName(day: CalendarDay): string {
  if (day.isSelected) return 'h-full w-full items-center justify-center gap-0.5 rounded-full bg-success';
  if (day.isToday) return 'h-full w-full items-center justify-center gap-0.5 rounded-full bg-warning/20';

  return 'h-full w-full items-center justify-center gap-0.5 rounded-full';
}

/** 自定义日期格：保留选中、今天、禁用等状态，并给 5 的倍数加提示点 */
function renderMarkedDay(day: CalendarDay): ReactNode {
  const containerClassName = getDayContainerClassName(day);
  const labelClassName = getDayLabelClassName(day);

  return (
    <View className={containerClassName}>
      <Text className={labelClassName}>{day.text}</Text>
      {day.number % 5 === 0 ? (
        <View
          className={day.isSelected ? 'size-1 rounded-full bg-primary-foreground' : 'size-1 rounded-full bg-info'}
        />
      ) : null}
    </View>
  );
}

const CUSTOM_COMPONENTS: CalendarComponents = {
  Day: renderMarkedDay
};

const CalendarCustom = () => {
  const [customDate, setCustomDate] = useState<DateType>(TODAY);

  return (
    <View className="overflow-hidden rounded-3xl border border-border bg-muted/30">
      <Calendar
        date={customDate}
        locale="zh"
        mode="single"
        className="bg-transparent"
        classNames={{
          header: 'rounded-xl bg-muted px-2',
          weekday_label: 'font-semibold text-info'
        }}
        components={CUSTOM_COMPONENTS}
        onChange={({ date }) => setCustomDate(date)}
      />
    </View>
  );
};

export { CalendarCustom };
