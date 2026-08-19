import { Stepper, Text } from '@skyroc/native-ui';
import type { StepperStepType } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const StepperEvents = () => {
  const [tip, setTip] = useState('等待操作');

  function handleOverlimit(type: StepperStepType) {
    setTip(type === 'minus' ? 'onOverlimit：已到最小值' : 'onOverlimit：已到最大值');
  }

  function handleMinus() {
    setTip('onMinus：减少一步');
  }

  function handlePlus() {
    setTip('onPlus：增加一步');
  }

  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-2">
        <Stepper
          max={3}
          min={1}
          onMinus={handleMinus}
          onOverlimit={handleOverlimit}
          onPlus={handlePlus}
        />
        <Text color="muted">{tip}</Text>
      </View>
    </View>
  );
};

export { StepperEvents };
