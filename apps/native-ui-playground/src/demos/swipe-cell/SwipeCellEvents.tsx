import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const SwipeCellEvents = () => {
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
        onClose={({ name, position }) => Alert.alert('关闭', `name: ${name}, position: ${position}`)}
        onOpen={({ name, position }) => Alert.alert('打开', `name: ${name}, position: ${position}`)}
      >
        <Cell
          title="单元格"
          trailing="滑动查看事件"
        />
      </SwipeCell>
    </View>
  );
};

export { SwipeCellEvents };
