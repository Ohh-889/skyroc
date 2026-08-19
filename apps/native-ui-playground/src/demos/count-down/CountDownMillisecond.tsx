import { CountDown } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownMillisecond = () => {
  return (
    <View className="gap-2 bg-background px-6 py-4">
      <CountDown
        millisecond
        format="ss:SS"
        time={10 * 1000}
      />
      {/* 缺失的高位单位会并入低位：只有 SSS 时，10 秒显示为 10000 起的总毫秒数 */}
      <CountDown
        millisecond
        format="SSS 毫秒"
        time={10 * 1000}
      />
    </View>
  );
};

export { CountDownMillisecond };
