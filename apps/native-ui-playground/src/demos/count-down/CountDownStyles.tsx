import { CountDown, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownStyles = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">根容器 className</Text>
        <CountDown
          className="items-center rounded-xl bg-secondary py-3"
          time={60 * 1000}
        />
      </View>
      <View className="gap-1">
        <Text className="text-sm text-muted-foreground">root / text slot</Text>
        <CountDown
          classNames={{
            root: 'items-center rounded-xl border border-primary py-3',
            text: 'text-2xl font-semibold text-primary'
          }}
          time={60 * 1000}
        />
      </View>
    </View>
  );
};

export { CountDownStyles };
