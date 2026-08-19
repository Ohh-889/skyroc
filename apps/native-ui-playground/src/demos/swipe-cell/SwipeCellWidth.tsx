import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwipeCellWidth = () => {
  return (
    <View className="bg-muted">
      <SwipeCell
        leading={
          <View className="w-[100px] items-center justify-center bg-primary">
            <Text className="text-sm text-primary-foreground">收藏</Text>
          </View>
        }
        leadingWidth={100}
        trailing={
          <View className="w-[80px] items-center justify-center bg-destructive">
            <Text className="text-sm text-destructive-foreground">删除</Text>
          </View>
        }
        trailingWidth={80}
      >
        <Cell
          title="单元格"
          trailing="自定义宽度"
        />
      </SwipeCell>
    </View>
  );
};

export { SwipeCellWidth };
