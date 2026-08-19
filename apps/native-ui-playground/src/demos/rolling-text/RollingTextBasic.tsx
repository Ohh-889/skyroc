import { RollingText } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextBasic = () => {
  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        startNum={0}
        targetNum={123}
      />
    </View>
  );
};

export { RollingTextBasic };
