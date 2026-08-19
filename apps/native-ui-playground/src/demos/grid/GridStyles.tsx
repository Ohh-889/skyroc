import { Grid } from '@skyroc/native-ui';
import type { GridItemData } from '@skyroc/native-ui';
import { View } from 'react-native';
import { BASIC_ITEMS } from './shared';

const STYLE_ITEMS: GridItemData[] = [
  BASIC_ITEMS[0],
  {
    ...BASIC_ITEMS[1],
    classNames: {
      content: 'bg-warning/10',
      icon: 'opacity-70',
      text: 'text-warning'
    }
  }
];

const GridStyles = () => {
  return (
    <View className="bg-background p-4">
      <Grid
        className="rounded-xl bg-primary/5 p-2"
        classNames={{
          content: 'rounded-xl bg-background p-3',
          icon: 'opacity-80',
          item: 'rounded-xl border border-primary/20',
          text: 'font-medium text-primary'
        }}
        columnNum={2}
        gutter={8}
        items={STYLE_ITEMS}
      />
    </View>
  );
};

export { GridStyles };
