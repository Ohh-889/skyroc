import { Button, RollingText } from '@skyroc/native-ui';
import type { RollingTextRef } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

const RollingTextManual = () => {
  const rollingRef = useRef<RollingTextRef>(null);

  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        ref={rollingRef}
        autoStart={false}
        startNum={0}
        targetNum={5678}
      />
      <View className="mt-3 flex-row gap-2">
        <Button
          size="sm"
          onPress={() => rollingRef.current?.start()}
        >
          Start
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={() => rollingRef.current?.reset()}
        >
          Reset
        </Button>
      </View>
    </View>
  );
};

export { RollingTextManual };
