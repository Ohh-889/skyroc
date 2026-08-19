import { Button, Slider, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SliderControlled = () => {
  const [controlled, setControlled] = useState(50);

  return (
    <View className="gap-3 bg-background px-6 py-4">
      <Slider
        step={5}
        value={controlled}
        onChange={setControlled}
      />
      <Text color="muted">当前值：{controlled}</Text>
      <View className="flex-row gap-2">
        <Button
          color="primary"
          variant="outline"
          onPress={() => setControlled(Math.max(0, controlled - 5))}
        >
          -5
        </Button>
        <Button
          color="primary"
          variant="outline"
          onPress={() => setControlled(Math.min(100, controlled + 5))}
        >
          +5
        </Button>
        <Button
          color="primary"
          variant="ghost"
          onPress={() => setControlled(50)}
        >
          重置
        </Button>
      </View>
    </View>
  );
};

export { SliderControlled };
