import { Button, RollingText, Text } from '@skyroc/native-ui';
import type { RollingTextRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';

const RollingTextManual = () => {
  const rollingRef = useRef<RollingTextRef>(null);
  const [finishCount, setFinishCount] = useState(0);

  function handleFinish() {
    setFinishCount(current => current + 1);
  }

  function reset() {
    rollingRef.current?.reset();
  }

  function start() {
    rollingRef.current?.start();
  }

  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        ref={rollingRef}
        autoStart={false}
        startNum={0}
        targetNum={5678}
        onFinish={handleFinish}
      />
      <Text
        className="mt-2"
        color="muted"
      >
        onFinish 次数：{finishCount}
      </Text>
      <View className="mt-3 flex-row gap-2">
        <Button
          size="sm"
          onPress={start}
        >
          开始
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={reset}
        >
          重置
        </Button>
      </View>
    </View>
  );
};

export { RollingTextManual };
