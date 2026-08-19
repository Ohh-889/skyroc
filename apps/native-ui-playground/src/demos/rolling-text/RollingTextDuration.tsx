import { RollingText } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextDuration = () => {
  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        duration={3000}
        startNum={0}
        targetNum={9999}
      />
    </View>
  );
};

export { RollingTextDuration };
