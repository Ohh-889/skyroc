import { CountDown, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownFormat = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">完整日期时间</Text>
        <CountDown
          format="DD 天 HH 时 mm 分 ss 秒"
          time={30 * 60 * 60 * 1000}
        />
      </View>
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">高位累加到分钟</Text>
        <CountDown
          format="mm:ss"
          time={90 * 1000}
        />
      </View>
    </View>
  );
};

export { CountDownFormat };
