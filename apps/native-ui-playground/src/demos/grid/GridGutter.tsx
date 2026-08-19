import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { GRID_ITEMS } from './shared';

const GridGutter = () => {
  return (
    <View className="bg-muted px-6">
      <View className="mb-8">
        <Grid
          gutter={12}
          items={GRID_ITEMS}
          classNames={{ content: 'rounded-2xl border border-border/70 bg-background' }}
        />
      </View>
    </View>
  );
};

export { GridGutter };
