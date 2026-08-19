import { RollingText } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextStopOrder = () => {
  return (
    <View className="bg-background items-center px-4 py-6">
      <RollingText
        startNum={0}
        stopOrder="rtl"
        targetNum={789}
      />
    </View>
  );
};

export { RollingTextStopOrder };
