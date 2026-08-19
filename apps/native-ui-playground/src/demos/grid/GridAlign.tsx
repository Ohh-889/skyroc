import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { BASIC_ITEMS } from './shared';

const GridAlign = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <Grid
          border
          center={false}
          items={BASIC_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridAlign };
