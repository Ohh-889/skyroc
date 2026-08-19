import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SwipeCellEvents = () => {
  const [lastEvent, setLastEvent] = useState('等待滑动');

  return (
    <View className="bg-muted">
      <SwipeCell
        name="event-demo"
        trailing={
          <>
            <View className="w-16 items-center justify-center bg-primary">
              <Text className="text-sm text-primary-foreground">编辑</Text>
            </View>
            <View className="w-16 items-center justify-center bg-destructive">
              <Text className="text-sm text-destructive-foreground">删除</Text>
            </View>
          </>
        }
        onClose={({ name, position }) => setLastEvent(`onClose · ${name} · ${position}`)}
        onOpen={({ name, position }) => setLastEvent(`onOpen · ${name} · ${position}`)}
      >
        <Cell
          title="单元格"
          trailing="滑动查看事件"
        />
      </SwipeCell>
      <Text className="px-4 pt-3 text-sm text-muted-foreground">{lastEvent}</Text>
    </View>
  );
};

export { SwipeCellEvents };
