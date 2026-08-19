import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { GRID_ITEMS } from './shared';

const GridGutter = () => {
  return (
    <View className="bg-background p-4">
      <View>
        <Grid
          gutter={12}
          items={GRID_ITEMS}
          classNames={{ content: 'rounded-xl border border-border bg-background' }}
        />
      </View>
    </View>
  );
};

export { GridGutter };
