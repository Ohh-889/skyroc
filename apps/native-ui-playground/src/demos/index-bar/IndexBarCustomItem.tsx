import { Divider, IndexBar, Text } from '@skyroc/native-ui';
import type { IndexBarChild, IndexBarSection } from '@skyroc/native-ui';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CITY_ITEMS, toAreaCode } from './shared';

/** 自定义子项的高度，同时是 IndexBar 的滚动定位度量，所以只在这里写一次 */
const CUSTOM_ITEM_HEIGHT = 64;

const IndexBarCustomItem = () => {
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);
  const [pressedItem, setPressedItem] = useState<IndexBarChild | null>(null);

  /** 外层已经被钉在 CUSTOM_ITEM_HEIGHT 上，这里只负责把内容撑满并垂直居中 */
  function renderCityItem(item: IndexBarChild, section: IndexBarSection) {
    return (
      <Pressable
        className="h-full flex-row items-center gap-3 px-3 active:opacity-80"
        onPress={() => setPressedItem(item)}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Text className="text-sm font-semibold text-primary">{section.title}</Text>
        </View>

        <View className="flex-1 gap-1">
          <Text className="text-sm font-medium text-foreground">{item.text}</Text>
          <Text className="text-xs text-muted-foreground">区号 {toAreaCode(item.key)}</Text>
        </View>
      </Pressable>
    );
  }

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
          itemHeight={CUSTOM_ITEM_HEIGHT}
          items={CITY_ITEMS}
          renderItem={renderCityItem}
          sectionHeaderHeight={28}
          onIndexChange={setActiveIndex}
        />
      </View>
    </View>
  );
};

export { IndexBarCustomItem };
