import { Slider, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SliderBasic = () => {
  const [basic, setBasic] = useState(30);

  return (
    <View className="gap-2 bg-background p-4">
      <Slider
        value={basic}
        onChange={setBasic}
      />
      <Text color="muted">当前值：{basic}</Text>
    </View>
  );
};

export { SliderBasic };
