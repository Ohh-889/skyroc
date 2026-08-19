import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { BASIC_ITEMS } from './shared';

const GridHorizontal = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <Grid
          border
          columnNum={2}
          direction="horizontal"
          items={BASIC_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridHorizontal };
