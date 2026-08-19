import { DatePickerView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const INITIAL_DATE = ['2026', '08', '19'];

const DatePickerControlled = () => {
  const [value, setValue] = useState(INITIAL_DATE);

  return (
    <View className="bg-background p-4">
      <Text className="mb-2 text-sm text-muted-foreground">当前 value：{value.join('-')}</Text>
      <DatePickerView
        showToolbar={false}
        value={value}
        onChange={setValue}
      />
    </View>
  );
};

export { DatePickerControlled };
