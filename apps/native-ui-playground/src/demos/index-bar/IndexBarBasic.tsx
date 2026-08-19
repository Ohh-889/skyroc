import { Divider, IndexBar, Text } from '@skyroc/native-ui';
import type { IndexBarChild } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { CITY_ITEMS } from './shared';

const IndexBarBasic = () => {
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);
  const [pressedItem, setPressedItem] = useState<IndexBarChild | null>(null);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 py-3">
        <Text className="text-xs text-muted-foreground">当前索引：{activeIndex}</Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          {pressedItem ? `点击了 ${pressedItem.text}` : '试着滚动列表看高亮联动'}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <IndexBar
          items={CITY_ITEMS}
          onIndexChange={setActiveIndex}
          onPressItem={setPressedItem}
        />
      </View>
    </View>
  );
};

export { IndexBarBasic };
