import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const TagShape = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag shape="rounded">rounded</Tag>
      <Tag shape="pill">pill</Tag>
      <Tag shape="mark">mark</Tag>
    </View>
  );
};

export { TagShape };
