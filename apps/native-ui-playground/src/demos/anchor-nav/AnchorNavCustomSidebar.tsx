import { AnchorNav, Divider, Text } from '@skyroc/native-ui';
import type { AnchorNavChild, AnchorNavSidebarContext } from '@skyroc/native-ui';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { LIBRARY_DATA } from './shared';

function renderCustomSidebar(context: AnchorNavSidebarContext) {
  const { activeIndex, items, onPressIndex } = context;

  return (
    <ScrollView
      className="w-20 shrink-0 grow-0 bg-muted/50"
      contentContainerClassName="gap-1 py-2"
      showsVerticalScrollIndicator={false}
    >
      {items.map((item, index) => (
        <Pressable
          accessibilityRole="button"
          className={
            activeIndex === index
              ? 'mx-2 min-h-12 justify-center rounded-xl bg-primary/10 px-2'
              : 'mx-2 min-h-12 justify-center rounded-xl px-2'
          }
          disabled={item.disabled}
          key={item.key ?? index}
          onPress={() => onPressIndex(index)}
        >
          <Text
            className={
              activeIndex === index
                ? 'text-center text-xs font-semibold text-primary'
                : 'text-center text-xs text-muted-foreground'
            }
          >
            {item.title}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const AnchorNavCustomSidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedItem, setPressedItem] = useState<AnchorNavChild | null>(null);

  function handlePressItem(item: AnchorNavChild) {
    setPressedItem(item);
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
          items={LIBRARY_DATA}
          renderSidebar={renderCustomSidebar}
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      </View>
    </View>
  );
};

export { AnchorNavCustomSidebar };
