import { Space } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceCustomSize = () => {
  return (
    <View className="bg-background p-4">
      <Space size={20}>
        <View className="size-12 rounded-xl bg-info/15" />
        <View className="size-12 rounded-xl bg-info/30" />
        <View className="size-12 rounded-xl bg-info/50" />
      </Space>
    </View>
  );
};

export { SpaceCustomSize };
