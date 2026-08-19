import { Grid } from '@skyroc/native-ui';
import { View } from 'react-native';
import { BASIC_ITEMS } from './shared';

const GridAlign = () => {
  return (
    <View className="bg-muted px-6">
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
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
