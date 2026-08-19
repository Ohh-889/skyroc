import { CountDown, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownMillisecond = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">十分秒（S）</Text>
        <CountDown
          millisecond
          format="ss:S"
          time={10 * 1000}
        />
      </View>
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">百分秒（SS）</Text>
        <CountDown
          millisecond
          format="ss:SS"
          time={10 * 1000}
        />
      </View>
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">总毫秒数（SSS）</Text>
        <CountDown
          millisecond
          format="SSS 毫秒"
          time={10 * 1000}
        />
      </View>
    </View>
  );
};

export { CountDownMillisecond };
