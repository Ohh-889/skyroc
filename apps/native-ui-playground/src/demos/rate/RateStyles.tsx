import { Rate } from '@skyroc/native-ui';
import { View } from 'react-native';

const RateStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Rate
        className="self-start rounded-lg bg-secondary px-3 py-2"
        defaultValue={4}
      />
      <Rate
        classNames={{
          icon: 'accent-info',
          item: 'rounded-full bg-muted p-1'
        }}
        defaultValue={3}
      />
    </View>
  );
};

export { RateStyles };
