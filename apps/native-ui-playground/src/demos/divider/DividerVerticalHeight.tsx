import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerVerticalHeight = () => {
  return (
    <View className="bg-background p-4">
      <Text className="mb-1 text-xs text-muted-foreground">竖向分割线撑满父容器高度，这里父容器是 h-12</Text>
      <View className="h-12 flex-row items-center">
        <Text className="text-sm">A</Text>
        <Divider orientation="vertical" />
        <Text className="text-sm">B</Text>
        <Divider
          border="dashed"
          orientation="vertical"
        />
        <Text className="text-sm">C</Text>
      </View>
    </View>
  );
};

export { DividerVerticalHeight };
