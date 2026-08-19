import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { GRID_ITEMS } from './shared';

const GridColumnNum = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <Grid
          columnNum={3}
          items={GRID_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridColumnNum };
