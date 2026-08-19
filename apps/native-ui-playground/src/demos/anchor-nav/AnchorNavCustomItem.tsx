import { AnchorNav, Divider, Text } from '@skyroc/native-ui';
import type { AnchorNavChild, AnchorNavSection } from '@skyroc/native-ui';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { LIBRARY_DATA } from './shared';

const CUSTOM_ITEM_HEIGHT = 72;

function getExampleCount(key: string) {
  const seed = [...key].reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return 2 + (seed % 7);
}

const AnchorNavCustomItem = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedItem, setPressedItem] = useState<AnchorNavChild | null>(null);

  function handlePressItem(item: AnchorNavChild) {
    setPressedItem(item);
  }

  function renderLibraryItem(item: AnchorNavChild, section: AnchorNavSection) {
    return (
      <Pressable
        accessibilityRole="button"
        className="h-full flex-row items-center gap-3 px-3 active:opacity-80"
        onPress={() => handlePressItem(item)}
      >
        <View className="size-10 items-center justify-center rounded-xl bg-primary/10">
          <Text className="text-sm font-semibold text-primary">{section.title.slice(0, 1)}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-medium text-foreground">{item.text}</Text>
          <Text className="text-xs text-muted-foreground">
            {section.title} · {getExampleCount(item.key)} 个示例
          </Text>
        </View>
        <Text className="text-xs font-medium text-primary">查看</Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 py-3">
        <Text className="text-xs text-muted-foreground">
          当前分组：{activeIndex} · {LIBRARY_DATA[activeIndex].title}
        </Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">
          {pressedItem ? `点击了 ${pressedItem.text}` : '滚动列表可观察高亮联动'}
        </Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <AnchorNav
          itemHeight={CUSTOM_ITEM_HEIGHT}
          items={LIBRARY_DATA}
          renderItem={renderLibraryItem}
          sectionHeaderHeight={28}
          onIndexChange={setActiveIndex}
        />
      </View>
    </View>
  );
};

export { AnchorNavCustomItem };
