import { CountDown, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownCustomRender = () => {
  return (
    <View className="bg-background p-4">
      <CountDown
        className="flex-row items-center justify-center gap-2 rounded-xl bg-muted p-4"
        time={60 * 60 * 1000}
      >
        {current => (
          <>
            <Text className="min-w-10 rounded-lg bg-primary px-2 py-1 text-center text-primary-foreground">
              {current.hours}
            </Text>
            <Text className="text-primary">:</Text>
            <Text className="min-w-10 rounded-lg bg-primary px-2 py-1 text-center text-primary-foreground">
              {current.minutes}
            </Text>
            <Text className="text-primary">:</Text>
            <Text className="min-w-10 rounded-lg bg-primary px-2 py-1 text-center text-primary-foreground">
              {current.seconds}
            </Text>
          </>
        )}
      </CountDown>
    </View>
  );
};

export { CountDownCustomRender };
