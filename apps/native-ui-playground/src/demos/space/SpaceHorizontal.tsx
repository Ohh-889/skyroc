import { Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceHorizontal = () => {
  return (
    <View className="bg-background p-4">
      <Space>
        <View className="size-12 items-center justify-center rounded-xl bg-primary/10">
          <Text className="font-semibold text-primary">1</Text>
        </View>
        <View className="size-12 items-center justify-center rounded-xl bg-success/10">
          <Text className="font-semibold text-success">2</Text>
        </View>
        <View className="size-12 items-center justify-center rounded-xl bg-warning/10">
          <Text className="font-semibold text-warning">3</Text>
        </View>
      </Space>
    </View>
  );
};

export { SpaceHorizontal };
