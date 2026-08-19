import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const TagShape = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag shape="rounded">Rounded</Tag>
      <Tag shape="pill">Pill</Tag>
      <Tag shape="mark">Mark</Tag>
    </View>
  );
};

export { TagShape };
