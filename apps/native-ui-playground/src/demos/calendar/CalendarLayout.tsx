import { Calendar } from '@skyroc/native-ui';
import type { DateType } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 示例统一从当天零点开始，避免时分秒影响边界判断 */
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));

const CalendarLayout = () => {
  const [layoutDate, setLayoutDate] = useState<DateType>(TODAY);

  return (
    <View className="bg-background">
      <Calendar
        showOutsideDays={false}
        date={layoutDate}
        firstDayOfWeek={1}
        locale="zh"
        mode="single"
        navigationPosition="right"
        weekdaysFormat="short"
        onChange={({ date }) => setLayoutDate(date)}
      />
    </View>
  );
};

export { CalendarLayout };
