import { Cell, SwipeCell, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwipeCellStyles = () => {
  return (
    <View className="bg-background p-4">
      <SwipeCell
        className="rounded-2xl border border-primary-200"
        classNames={{
          content: 'bg-primary-50',
          leading: 'bg-success',
          overlay: 'bg-foreground/5',
          root: 'shadow-sm',
          trailing: 'bg-destructive'
        }}
        leading={
          <View className="w-20 items-center justify-center">
            <Text className="text-sm text-success-foreground">左侧</Text>
          </View>
        }
        trailing={
          <View className="w-20 items-center justify-center">
            <Text className="text-sm text-destructive-foreground">右侧</Text>
          </View>
        }
      >
        <Cell title="滑动查看各 slot" />
      </SwipeCell>
    </View>
  );
};

export { SwipeCellStyles };
