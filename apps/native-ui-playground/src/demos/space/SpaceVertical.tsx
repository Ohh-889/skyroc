import { Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceVertical = () => {
  return (
    <View className="bg-background p-4">
      <Space
        direction="vertical"
        fill
      >
        <View className="h-11 justify-center rounded-xl bg-primary/10 px-4">
          <Text className="font-medium text-primary">第一项</Text>
        </View>
        <View className="h-11 justify-center rounded-xl bg-success/10 px-4">
          <Text className="font-medium text-success">第二项</Text>
        </View>
        <View className="h-11 justify-center rounded-xl bg-warning/10 px-4">
          <Text className="font-medium text-warning">第三项</Text>
        </View>
      </Space>
    </View>
  );
};

export { SpaceVertical };
