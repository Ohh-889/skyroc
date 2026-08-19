import { Slider, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SliderRange = () => {
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 70]);

  return (
    <View className="gap-2 bg-background p-4">
      <Slider
        range
        value={rangeValue}
        onChange={setRangeValue}
      />
      <Text color="muted">
        当前区间：{rangeValue[0]} ~ {rangeValue[1]}
      </Text>
    </View>
  );
};

export { SliderRange };
