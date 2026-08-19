import { Button, Calendar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 示例统一从当天零点开始，避免时分秒影响边界判断 */
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

const CalendarControlledMonth = () => {
  const [visibleMonth, setVisibleMonth] = useState(TODAY.getMonth());
  const [visibleYear, setVisibleYear] = useState(TODAY.getFullYear());

  const visibleMonthLabel = `${visibleYear} 年 ${visibleMonth + 1} 月`;

  function moveVisibleMonth(offset: number) {
    const nextDate = new Date(visibleYear, visibleMonth + offset, 1);

    setVisibleMonth(nextDate.getMonth());
    setVisibleYear(nextDate.getFullYear());
  }

  return (
    <View className="bg-background">
      <View className="flex-row items-center justify-between gap-3 px-4 pt-4">
        <Button
          size="sm"
          variant="outline"
          onPress={() => moveVisibleMonth(-1)}
        >
          上个月
        </Button>
        <Text className="font-medium text-foreground">{visibleMonthLabel}</Text>
        <Button
          size="sm"
          variant="outline"
          onPress={() => moveVisibleMonth(1)}
        >
          下个月
        </Button>
      </View>
      <Calendar
        hideHeader
        locale="zh"
        mode="single"
        month={visibleMonth}
        year={visibleYear}
        onMonthChange={setVisibleMonth}
        onYearChange={setVisibleYear}
      />
    </View>
  );
};

export { CalendarControlledMonth };
