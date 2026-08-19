import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerVertical = () => {
  return (
    <View className="bg-background p-4">
      <Text className="text-sm text-foreground">横向分割上下内容</Text>
      <Divider orientation="horizontal" />
      <View className="h-12 flex-row items-center">
        <Text className="text-sm text-foreground">左侧</Text>
        <Divider orientation="vertical" />
        <Text className="text-sm text-foreground">中间</Text>
        <Divider orientation="vertical" />
        <Text className="text-sm text-foreground">右侧</Text>
      </View>
    </View>
  );
};

export { DividerVertical };
