import { Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const SpaceSize = () => {
  return (
    <View className="bg-background p-4">
      <Space
        direction="vertical"
        fill
        size="lg"
      >
        {SIZES.map(size => (
          <View key={size}>
            <Text className="mb-2 text-xs text-muted-foreground">{size === 'md' ? 'md（默认）' : size}</Text>
            <Space size={size}>
              <View className="size-9 rounded-lg bg-primary/15" />
              <View className="size-9 rounded-lg bg-primary/30" />
              <View className="size-9 rounded-lg bg-primary/50" />
            </Space>
          </View>
        ))}
      </Space>
    </View>
  );
};

export { SpaceSize };
