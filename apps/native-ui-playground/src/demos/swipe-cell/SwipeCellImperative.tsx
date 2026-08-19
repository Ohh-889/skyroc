import { Button, Cell, SwipeCell, Text } from '@skyroc/native-ui';
import type { SwipeCellInstance } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

const SwipeCellImperative = () => {
  const swipeCellRef = useRef<SwipeCellInstance>(null);

  return (
    <View className="bg-muted">
      <View className="mb-3 flex-row gap-3 px-4">
        <Button
          size="sm"
          onPress={() => swipeCellRef.current?.open('left')}
        >
          打开左侧
        </Button>
        <Button
          size="sm"
          onPress={() => swipeCellRef.current?.open('right')}
        >
          打开右侧
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={() => swipeCellRef.current?.close()}
        >
          关闭
        </Button>
      </View>
      <SwipeCell
        ref={swipeCellRef}
        leading={
          <View className="w-16 items-center justify-center bg-primary">
            <Text className="text-sm text-primary-foreground">选择</Text>
          </View>
        }
        trailing={
          <View className="w-16 items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
      >
        <Cell
          title="单元格"
          trailing="编程式控制"
        />
      </SwipeCell>
    </View>
  );
};

export { SwipeCellImperative };
