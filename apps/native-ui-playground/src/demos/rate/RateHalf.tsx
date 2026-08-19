import { Rate, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const RateHalf = () => {
  const [value, setValue] = useState(2.5);

  return (
    <View className="gap-2 bg-background p-4">
      <Rate
        allowHalf
        value={value}
        onChange={setValue}
      />
      <Text color="muted">当前分值：{value}</Text>
    </View>
  );
};

export { RateHalf };
