import { Slider, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SliderStep = () => {
  const [stepped, setStepped] = useState(60);

  return (
    <View className="gap-2 bg-background p-4">
      <Slider
        max={200}
        min={20}
        step={20}
        value={stepped}
        onChange={setStepped}
      />
      <Text color="muted">当前值：{stepped}（20 ~ 200，步长 20）</Text>
    </View>
  );
};

export { SliderStep };
