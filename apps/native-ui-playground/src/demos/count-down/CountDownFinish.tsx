import { CountDown, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CountDownFinish = () => {
  const [seconds, setSeconds] = useState(5);
  const [finishCount, setFinishCount] = useState(0);

  return (
    <View className="gap-2 bg-background p-4">
      <View className="flex-row items-center gap-2">
        <CountDown
          format="ss"
          time={5 * 1000}
          onChange={current => setSeconds(current.seconds)}
          onFinish={() => setFinishCount(prev => prev + 1)}
        />
        <Text className="text-sm text-muted-foreground">onChange：剩余 {seconds} 秒</Text>
      </View>
      <Text className="text-sm text-muted-foreground">onFinish：已触发 {finishCount} 次</Text>
    </View>
  );
};

export { CountDownFinish };
