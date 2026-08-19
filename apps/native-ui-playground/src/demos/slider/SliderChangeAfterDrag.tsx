import { Slider, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SliderChangeAfterDrag = () => {
  const [settled, setSettled] = useState(30);

  return (
    <View className="gap-2 bg-background p-4">
      <Slider
        defaultValue={30}
        onChangeAfterDrag={setSettled}
      />
      <Text color="muted">松手后的值：{settled}</Text>
    </View>
  );
};

export { SliderChangeAfterDrag };
