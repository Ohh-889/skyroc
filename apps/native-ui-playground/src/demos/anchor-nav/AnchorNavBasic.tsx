import { AnchorNav, Divider, Text } from '@skyroc/native-ui';
import type { AnchorNavChild } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { LIBRARY_DATA } from './shared';

const AnchorNavBasic = () => {
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
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      </View>
    </View>
  );
};

export { AnchorNavBasic };
