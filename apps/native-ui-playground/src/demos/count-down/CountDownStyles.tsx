import { CountDown } from '@skyroc/native-ui';
import { View } from 'react-native';

const CountDownStyles = () => {
  return (
    <View className="gap-3 bg-background px-6 py-4">
      <CountDown
        className="items-center rounded-lg bg-secondary py-3"
        time={60 * 1000}
      />
      <CountDown
        classNames={{
          root: 'items-center rounded-lg border border-primary py-3',
          text: 'text-2xl font-semibold text-primary'
        }}
        time={60 * 1000}
      />
    </View>
  );
};

export { CountDownStyles };
