import { Divider, IndexBar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { CITY_ITEMS } from './shared';

const ITEM_HEIGHT = 52;
const SECTION_HEADER_HEIGHT = 40;

const IndexBarMetrics = () => {
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 py-3">
        <Text className="text-xs text-muted-foreground">当前索引：{activeIndex}</Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          itemHeight={ITEM_HEIGHT} · sectionHeaderHeight={SECTION_HEADER_HEIGHT}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <IndexBar
          itemHeight={ITEM_HEIGHT}
          items={CITY_ITEMS}
          sectionHeaderHeight={SECTION_HEADER_HEIGHT}
          onIndexChange={setActiveIndex}
        />
      </View>
    </View>
  );
};

export { IndexBarMetrics };
