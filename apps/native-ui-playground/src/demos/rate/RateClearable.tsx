import { Rate, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const RateClearable = () => {
  const [value, setValue] = useState(3);

  return (
    <View className="gap-2 bg-background p-4">
      <Rate
        clearable
        value={value}
        onChange={setValue}
      />
      <Text color="muted">当前分值：{value}</Text>
    </View>
  );
};

export { RateClearable };
