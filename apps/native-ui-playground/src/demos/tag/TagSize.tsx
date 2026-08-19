import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const TagSize = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag size="sm">sm</Tag>
      <Tag size="md">md</Tag>
      <Tag size="lg">lg</Tag>
    </View>
  );
};

export { TagSize };
