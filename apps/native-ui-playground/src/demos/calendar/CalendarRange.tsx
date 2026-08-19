import { Calendar, Text } from '@skyroc/native-ui';
import type { DateType } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 把 DateType 格式化成 YYYY-MM-DD */
function formatDate(date: DateType): string {
  if (!date) return '未选择';

  const parsed = new Date(date as Date | number | string);
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${parsed.getFullYear()}-${month}-${day}`;
}

const CalendarRange = () => {
  const [rangeStart, setRangeStart] = useState<DateType>();
  const [rangeEnd, setRangeEnd] = useState<DateType>();

  const rangeLabel = `${formatDate(rangeStart)} 至 ${formatDate(rangeEnd)}`;

  return (
    <View className="bg-background">
      <Calendar
        allowRangeReset
        endDate={rangeEnd}
        locale="zh"
        max={7}
        min={2}
        mode="range"
        startDate={rangeStart}
        onChange={({ endDate, startDate }) => {
          setRangeStart(startDate);
          setRangeEnd(endDate);
        }}
      />
      <Text className="px-4 pb-4 text-sm text-muted-foreground">当前：{rangeLabel}</Text>
    </View>
  );
};

export { CalendarRange };
