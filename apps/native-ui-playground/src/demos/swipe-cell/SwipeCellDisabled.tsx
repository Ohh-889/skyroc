import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwipeCellDisabled = () => {
  return (
    <View className="bg-muted">
      <SwipeCell
        disabled
        trailing={
          <View className="w-16 items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
      >
        <Cell
          title="单元格"
          trailing="禁用状态"
        />
      </SwipeCell>
    </View>
  );
};

export { SwipeCellDisabled };
