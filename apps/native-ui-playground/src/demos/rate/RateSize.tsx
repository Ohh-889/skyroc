import { Rate } from '@skyroc/native-ui';
import { View } from 'react-native';

const RateSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Rate
        count={3}
        defaultValue={2}
        size={20}
      />
      <Rate defaultValue={3} />
      <Rate
        count={7}
        defaultValue={5}
        gutter={8}
        size={32}
      />
    </View>
  );
};

export { RateSize };
