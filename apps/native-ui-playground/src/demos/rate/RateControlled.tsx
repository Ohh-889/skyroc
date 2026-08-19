import { Button, Rate } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const RateControlled = () => {
  const [value, setValue] = useState(4);

  return (
    <View className="gap-3 bg-background p-4">
      <Rate
        allowHalf
        value={value}
        onChange={setValue}
      />
      <View className="flex-row gap-2">
        <Button
          color="primary"
          variant="outline"
          onPress={() => setValue(Math.max(0, value - 0.5))}
        >
          -0.5
        </Button>
        <Button
          color="primary"
          variant="outline"
          onPress={() => setValue(Math.min(5, value + 0.5))}
        >
          +0.5
        </Button>
        <Button
          color="primary"
          variant="ghost"
          onPress={() => setValue(0)}
        >
          重置
        </Button>
      </View>
    </View>
  );
};

export { RateControlled };
