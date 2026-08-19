import { CountDown, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownBasic = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">60 秒倒计时</Text>
        <CountDown time={60 * 1000} />
      </View>
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">零时长</Text>
        <CountDown
          autoStart={false}
          time={0}
        />
      </View>
    </View>
  );
};

export { CountDownBasic };
