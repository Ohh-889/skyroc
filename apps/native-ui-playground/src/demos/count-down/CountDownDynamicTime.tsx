import { Button, CountDown } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DURATIONS = [10, 30, 60];

const CountDownDynamicTime = () => {
  const [duration, setDuration] = useState(30);

  return (
    <View className="bg-background px-6 py-4">
      <View className="mb-4">
        <CountDown
          format="mm:ss"
          time={duration * 1000}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        {DURATIONS.map(seconds => (
          <Button
            key={seconds}
            variant={seconds === duration ? 'solid' : 'tonal'}
            onPress={() => setDuration(seconds)}
          >
            {`${seconds} 秒`}
          </Button>
        ))}
      </View>
    </View>
  );
};

export { CountDownDynamicTime };
