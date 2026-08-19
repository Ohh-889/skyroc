import { Rate } from '@skyroc/native-ui';
import { View } from 'react-native';

const RateDisabled = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Rate
        disabled
        defaultValue={3}
      />
      <Rate
        allowHalf
        disabled
        defaultValue={2.5}
      />
    </View>
  );
};

export { RateDisabled };
