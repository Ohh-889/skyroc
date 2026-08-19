import { Calendar, Text } from '@skyroc/native-ui';
import type { DateType } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 一天的毫秒数，用于构造稳定、易读的相对日期示例 */
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/** 示例统一从当天零点开始，避免时分秒影响边界判断 */
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

/** 给日期增加指定天数 */
function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + amount * DAY_IN_MS);
}

/** 把 DateType 格式化成 YYYY-MM-DD */
function formatDate(date: DateType): string {
  if (!date) return '未选择';

  const parsed = new Date(date as Date | number | string);
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${parsed.getFullYear()}-${month}-${day}`;
}

const CalendarMinMax = () => {
  const [limitedDate, setLimitedDate] = useState<DateType>(TODAY);

  return (
    <View className="bg-background">
      <Calendar
        date={limitedDate}
        locale="zh"
        maxDate={addDays(TODAY, 30)}
        minDate={TODAY}
        mode="single"
        onChange={({ date }) => setLimitedDate(date)}
      />
      <Text className="px-4 pb-4 text-sm text-muted-foreground">当前：{formatDate(limitedDate)}</Text>
    </View>
  );
};

export { CalendarMinMax };
