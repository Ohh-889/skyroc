import { Grid } from '@skyroc/native-ui';
import type { GridItemData } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';
import { BASIC_ITEMS, GRID_ITEMS } from './shared';

function handlePress(label: string) {
  Alert.alert(label, '宫格项已点击');
}

const GridPress = () => {
  const clickableItems: GridItemData[] = BASIC_ITEMS.map(item => ({
    ...item,
    onPress: () => handlePress(String(item.text))
  }));

  return (
    <View className="bg-muted px-6">
      <View className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Grid
          border
          items={[
            ...clickableItems,
            {
              ...GRID_ITEMS[4],
              disabled: true,
              onPress: () => handlePress('日程')
            }
          ]}
        />
      </View>
    </View>
  );
};

export { GridPress };
