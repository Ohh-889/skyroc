import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwipeCellExclusive = () => {
  return (
    <View className="gap-4 bg-muted p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <SwipeCell
          trailing={
            <View className="w-20 items-center justify-center bg-destructive">
              <Text className="text-sm text-destructive-foreground">操作 A</Text>
            </View>
          }
        >
          <Cell title="默认互斥 A" />
        </SwipeCell>
        <SwipeCell
          trailing={
            <View className="w-20 items-center justify-center bg-destructive">
              <Text className="text-sm text-destructive-foreground">操作 B</Text>
            </View>
          }
        >
          <Cell title="默认互斥 B" />
        </SwipeCell>
      </View>

      <View className="overflow-hidden rounded-xl border border-border">
        <SwipeCell
          exclusive={false}
          trailing={
            <View className="w-20 items-center justify-center bg-primary">
              <Text className="text-sm text-primary-foreground">操作 C</Text>
            </View>
          }
        >
          <Cell title="可同时展开 C" />
        </SwipeCell>
        <SwipeCell
          exclusive={false}
          trailing={
            <View className="w-20 items-center justify-center bg-primary">
              <Text className="text-sm text-primary-foreground">操作 D</Text>
            </View>
          }
        >
          <Cell title="可同时展开 D" />
        </SwipeCell>
      </View>
    </View>
  );
};

export { SwipeCellExclusive };
