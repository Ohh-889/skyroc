import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const TagSize = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </View>
  );
};

export { TagSize };
