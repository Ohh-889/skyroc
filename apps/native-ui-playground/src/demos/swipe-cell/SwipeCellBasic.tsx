import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwipeCellBasic = () => {
  return (
    <View className="bg-muted">
      <SwipeCell
        leading={
          <View className="w-16 items-center justify-center bg-primary">
            <Text className="text-sm text-primary-foreground">选择</Text>
          </View>
        }
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
      >
        <Cell
          title="单元格"
          trailing="内容"
        />
      </SwipeCell>
    </View>
  );
};

export { SwipeCellBasic };
