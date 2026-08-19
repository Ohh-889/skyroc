import { Button, Stepper } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const StepperControlled = () => {
  const [controlled, setControlled] = useState(2);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <Stepper
          max={20}
          min={0}
          value={controlled}
          onChange={setControlled}
        />
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
            onPress={() => setControlled(Math.min(20, controlled + 5))}
          >
            +5
          </Button>
          <Button
            color="primary"
            variant="ghost"
            onPress={() => setControlled(0)}
          >
            重置
          </Button>
        </View>
      </View>
    </View>
  );
};

export { StepperControlled };
