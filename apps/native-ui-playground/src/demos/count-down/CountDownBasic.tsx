import { CountDown } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownBasic = () => {
  return (
    <View className="bg-background px-6 py-4">
      <CountDown time={60 * 1000} />
    </View>
  );
};

export { CountDownBasic };
