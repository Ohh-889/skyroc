import { RollingText } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextDirection = () => {
  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        direction="up"
        startNum={0}
        targetNum={456}
      />
    </View>
  );
};

export { RollingTextDirection };
