import { Button, CountDown } from '@skyroc/native-ui';
import type { CountDownRef } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

const CountDownManual = () => {
  const manualRef = useRef<CountDownRef>(null);

  function handleReset() {
    manualRef.current?.reset();
  }

  function handleResetTo(seconds: number) {
    manualRef.current?.reset(seconds * 1000);
  }

  return (
    <View className="bg-background px-6 py-4">
      <View className="mb-4">
        <CountDown
          autoStart={false}
          format="mm:ss:SSS"
          millisecond
          ref={manualRef}
          time={20 * 1000}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.start()}
        >
          开始
        </Button>
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.pause()}
        >
          暂停
        </Button>
        <Button
          variant="outline"
          onPress={handleReset}
        >
          重置
        </Button>
        <Button
          variant="outline"
          onPress={() => handleResetTo(5)}
        >
          重置为 5 秒
        </Button>
      </View>
    </View>
  );
};

export { CountDownManual };
