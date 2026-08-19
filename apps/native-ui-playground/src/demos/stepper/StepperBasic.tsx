import { Stepper, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const StepperBasic = () => {
  const [basic, setBasic] = useState(3);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-2">
        <Stepper
          value={basic}
          onChange={setBasic}
        />
        <Text color="muted">当前值：{basic}</Text>
      </View>
    </View>
  );
};

export { StepperBasic };
