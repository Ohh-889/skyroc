import { Calendar, Text } from '@skyroc/native-ui';
import type { DateType } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 示例统一从当天零点开始，避免时分秒影响边界判断 */
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

/** 把 DateType 格式化成 YYYY-MM-DD */
function formatDate(date: DateType): string {
  if (!date) return '未选择';

  const parsed = new Date(date as Date | number | string);
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${parsed.getFullYear()}-${month}-${day}`;
}

/** 周六、周日不可选 */
function isWeekend(date: DateType): boolean {
  if (!date) return false;

  const day = new Date(date as Date | number | string).getDay();

  return day === 0 || day === 6;
}

const CalendarDisabledDates = () => {
  const [disabledDate, setDisabledDate] = useState<DateType>(TODAY);

  return (
    <View className="bg-background">
      <Calendar
        date={disabledDate}
        disabledDates={isWeekend}
        locale="zh"
        mode="single"
        onChange={({ date }) => setDisabledDate(date)}
      />
      <Text className="px-4 pb-4 text-sm text-muted-foreground">当前：{formatDate(disabledDate)}</Text>
    </View>
  );
};

export { CalendarDisabledDates };
