import { Button, FloatingButton, Portal, Text } from '@skyroc/native-ui';
import type { FloatingButtonOffset as FloatingButtonOffsetValue } from '@skyroc/native-ui';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

const BUTTON_SIZE = 48;
const HORIZONTAL_GAP = 16;
const VERTICAL_GAP = 80;

const FloatingButtonOffset = () => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const [offset, setOffset] = useState<FloatingButtonOffsetValue>({
    x: HORIZONTAL_GAP,
    y: windowHeight - BUTTON_SIZE - VERTICAL_GAP
  });

  const offsetLabel = `x=${Math.round(offset.x)}, y=${Math.round(offset.y)}`;

  function moveToLeft() {
    setOffset(current => ({ x: HORIZONTAL_GAP, y: current.y }));
  }

  function moveToRight() {
    setOffset(current => ({ x: windowWidth - BUTTON_SIZE - HORIZONTAL_GAP, y: current.y }));
  }

  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row gap-2">
        <Button
          size="sm"
          variant="outline"
          onPress={moveToLeft}
        >
          移到左侧
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={moveToRight}
        >
          移到右侧
        </Button>
      </View>
      <Text className="text-sm text-muted-foreground">当前 offset：{offsetLabel}</Text>

      <Portal>
        <FloatingButton
          axis="xy"
          className="bg-info"
          gap={{ x: HORIZONTAL_GAP, y: VERTICAL_GAP }}
          offset={offset}
          onOffsetChange={setOffset}
        >
          <Text className="text-xs font-bold text-info-foreground">POS</Text>
        </FloatingButton>
      </Portal>
    </View>
  );
};

export { FloatingButtonOffset };
