import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { GRID_ITEMS } from './shared';

const GridGutterBorder = () => {
  return (
    <View className="bg-background p-4">
      <View className="rounded-xl bg-muted p-2">
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
