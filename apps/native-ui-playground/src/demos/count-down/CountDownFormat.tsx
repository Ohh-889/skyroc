import { CountDown } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownFormat = () => {
  return (
    <View className="gap-2 bg-background px-6 py-4">
      <CountDown
        format="DD 天 HH 时 mm 分 ss 秒"
        time={30 * 60 * 60 * 1000}
      />
      <CountDown
        format="mm:ss"
        time={90 * 1000}
      />
    </View>
  );
};

export { CountDownFormat };
