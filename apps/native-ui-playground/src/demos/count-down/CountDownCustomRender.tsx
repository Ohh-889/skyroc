import { CountDown, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownCustomRender = () => {
  return (
    <View className="bg-background px-6 py-4">
      <CountDown
        className="flex-row items-center gap-2 rounded-lg bg-muted p-3"
        time={60 * 60 * 1000}
      >
        {current => (
          <>
            <Text className="rounded bg-primary px-2 py-1 text-primary-foreground">{current.hours}</Text>
            <Text className="text-primary">:</Text>
            <Text className="rounded bg-primary px-2 py-1 text-primary-foreground">{current.minutes}</Text>
            <Text className="text-primary">:</Text>
            <Text className="rounded bg-primary px-2 py-1 text-primary-foreground">{current.seconds}</Text>
          </>
        )}
      </CountDown>
    </View>
  );
};

export { CountDownCustomRender };
