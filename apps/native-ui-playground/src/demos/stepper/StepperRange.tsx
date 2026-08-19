import { Stepper, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const StepperRange = () => {
  const [ranged, setRanged] = useState(4);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-2">
        <Stepper
          max={10}
          min={2}
          step={2}
          value={ranged}
          onChange={setRanged}
        />
        <Text color="muted">当前值：{ranged}</Text>
      </View>
    </View>
  );
};

export { StepperRange };
