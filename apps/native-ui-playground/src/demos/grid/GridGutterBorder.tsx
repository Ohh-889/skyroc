import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { GRID_ITEMS } from './shared';

const GridGutterBorder = () => {
  return (
    <View className="bg-muted px-6">
      <View className="mb-8 rounded-2xl bg-background p-2">
        <Grid
          border
          gutter={16}
          items={GRID_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridGutterBorder };
