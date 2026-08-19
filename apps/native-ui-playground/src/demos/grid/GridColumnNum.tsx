import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { GRID_ITEMS } from './shared';

const GridColumnNum = () => {
  return (
    <View className="bg-muted px-6">
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          columnNum={3}
          items={GRID_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridColumnNum };
