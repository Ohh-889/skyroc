import { Calendar, Text } from '@skyroc/native-ui';
import type { DateType } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CalendarMultiple = () => {
  const [multiDates, setMultiDates] = useState<DateType[]>([]);

  return (
    <View className="bg-background">
      <Calendar
        dates={multiDates}
        locale="zh"
        max={3}
        mode="multiple"
        onChange={({ dates }) => setMultiDates(dates)}
      />
      <Text className="px-4 pb-4 text-sm text-muted-foreground">已选 {multiDates.length} 天</Text>
    </View>
  );
};

export { CalendarMultiple };
