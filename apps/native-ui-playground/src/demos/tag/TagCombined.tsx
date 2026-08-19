import { Tag, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TagCombined = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag
        leading={<Text>★</Text>}
        variant="tonal"
      >
        前置内容
      </Tag>
      <Tag color="info">
        <View className="flex-row items-center gap-1">
          <Text>自定义节点</Text>
          <Text className="opacity-70">2</Text>
        </View>
      </Tag>
      <Tag color="warning">2026</Tag>
    </View>
  );
};

export { TagCombined };
