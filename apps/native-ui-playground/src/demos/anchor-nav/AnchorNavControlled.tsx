import { AnchorNav, Button, Divider, Text } from '@skyroc/native-ui';
import type { AnchorNavChild, AnchorNavRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { LIBRARY_DATA } from './shared';

const AnchorNavControlled = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pressedItem, setPressedItem] = useState<AnchorNavChild | null>(null);

  const anchorRef = useRef<AnchorNavRef>(null);

  const isFirstSection = activeIndex === 0;
  const isLastSection = activeIndex === LIBRARY_DATA.length - 1;

  function handlePressItem(item: AnchorNavChild) {
    setPressedItem(item);
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Button
          disabled={isFirstSection}
          size="sm"
          variant="outline"
          onPress={() => anchorRef.current?.scrollToSection(activeIndex - 1)}
        >
          上一组
        </Button>
        <Button
          disabled={isLastSection}
          size="sm"
          variant="tonal"
          onPress={() => anchorRef.current?.scrollToSection(activeIndex + 1)}
        >
          下一组
        </Button>
      </View>

      <View className="flex-row items-center gap-2 px-4 pb-3">
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
          ref={anchorRef}
          activeIndex={activeIndex}
          items={LIBRARY_DATA}
          onIndexChange={setActiveIndex}
          onPressItem={handlePressItem}
        />
      </View>
    </View>
  );
};

export { AnchorNavControlled };
