import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { SEVEN_ITEMS } from './shared';

const GridBorder = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <Grid
          border
          items={SEVEN_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridBorder };
