import { Button, RollingText } from '@skyroc/native-ui';
import type { RollingTextRef } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

const RollingTextTextMode = () => {
  const textRollingRef = useRef<RollingTextRef>(null);

  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        ref={textRollingRef}
        textList={['AAA', 'BBB', 'CCC', 'DDD', 'EEE']}
      />
      <View className="mt-3 flex-row gap-2">
        <Button
          size="sm"
          variant="outline"
          onPress={() => textRollingRef.current?.reset()}
        >
          Reset
        </Button>
      </View>
    </View>
  );
};

export { RollingTextTextMode };
