import { Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceFill = () => {
  return (
    <View className="bg-background p-4">
      <Space fill>
        <View className="flex-1 items-center justify-center rounded-xl bg-primary/10 py-3">
          <Text className="text-sm font-medium text-primary">左侧</Text>
        </View>
        <View className="flex-1 items-center justify-center rounded-xl bg-success/10 py-3">
          <Text className="text-sm font-medium text-success">右侧</Text>
        </View>
      </Space>
    </View>
  );
};

export { SpaceFill };
