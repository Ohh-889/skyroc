import { Button, RollingText, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const TARGETS = [8, 42, 2026, 7];

const RollingTextDynamic = () => {
  const [targetIndex, setTargetIndex] = useState(0);

  const targetNum = TARGETS[targetIndex];

  function changeTarget() {
    setTargetIndex(current => (current + 1) % TARGETS.length);
  }

  return (
    <View className="items-center gap-3 bg-background px-4 py-6">
      <RollingText targetNum={targetNum} />
      <Text color="muted">targetNum：{targetNum}</Text>
      <Button
        size="sm"
        variant="outline"
        onPress={changeTarget}
      >
        切换目标值
      </Button>
    </View>
  );
};

export { RollingTextDynamic };
