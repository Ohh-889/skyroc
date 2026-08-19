import { Cell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CellLeading = () => {
  return (
    <View className="bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          leading={
            <View className="size-9 items-center justify-center rounded-xl bg-primary/10">
              <Text className="text-sm font-semibold text-primary">A</Text>
            </View>
          }
          subtitle="leading 可以承载图标"
          title="图标入口"
        />
        <Cell
          leading={
            <View className="size-9 items-center justify-center rounded-full bg-success/10">
              <Text className="text-sm font-semibold text-success">林</Text>
            </View>
          }
          title="头像入口"
          trailing="在线"
        />
      </View>
    </View>
  );
};

export { CellLeading };
