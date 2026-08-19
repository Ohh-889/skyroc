import { RollingText, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextStopOrder = () => {
  return (
    <View className="flex-row justify-around bg-background px-4 py-6">
      <View className="items-center gap-2">
        <Text color="muted">ltr</Text>
        <RollingText
          delayStep={300}
          startNum={0}
          stopOrder="ltr"
          targetNum={123}
        />
      </View>
      <View className="items-center gap-2">
        <Text color="muted">rtl</Text>
        <RollingText
          delayStep={300}
          startNum={0}
          stopOrder="rtl"
          targetNum={789}
        />
      </View>
    </View>
  );
};

export { RollingTextStopOrder };
