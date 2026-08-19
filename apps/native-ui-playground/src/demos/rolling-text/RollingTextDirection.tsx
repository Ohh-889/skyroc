import { RollingText, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextDirection = () => {
  return (
    <View className="flex-row justify-around bg-background px-4 py-6">
      <View className="items-center gap-2">
        <Text color="muted">direction="down"</Text>
        <RollingText
          direction="down"
          startNum={0}
          targetNum={123}
        />
      </View>
      <View className="items-center gap-2">
        <Text color="muted">direction="up"</Text>
        <RollingText
          direction="up"
          startNum={0}
          targetNum={456}
        />
      </View>
    </View>
  );
};

export { RollingTextDirection };
