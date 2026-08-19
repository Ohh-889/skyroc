import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { SEVEN_ITEMS } from './shared';

const GridBorder = () => {
  return (
    <View className="bg-muted px-6">
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          items={SEVEN_ITEMS}
        />
      </View>
    </View>
  );
};

export { GridBorder };
