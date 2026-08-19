import { RollingText } from '@skyroc/native-ui';
import { View } from 'react-native';

const RollingTextStyles = () => {
  return (
    <View className="items-center bg-background px-4 py-6">
      <RollingText
        className="gap-1 rounded-xl bg-primary/10 px-3"
        classNames={{ text: 'text-2xl font-bold text-primary' }}
        height={48}
        startNum={100}
        targetNum={2026}
      />
    </View>
  );
};

export { RollingTextStyles };
