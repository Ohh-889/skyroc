import { Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceAlign = () => {
  return (
    <View className="bg-background p-4">
      <Space
        direction="vertical"
        fill
        size="lg"
      >
        <View>
          <Text className="mb-2 text-xs text-muted-foreground">start</Text>
          <Space align="start">
            <View className="h-8 w-12 rounded-lg bg-primary/20" />
            <View className="h-12 w-12 rounded-lg bg-primary/35" />
            <View className="h-16 w-12 rounded-lg bg-primary/50" />
          </Space>
        </View>
        <View>
          <Text className="mb-2 text-xs text-muted-foreground">center</Text>
          <Space align="center">
            <View className="h-8 w-12 rounded-lg bg-success/20" />
            <View className="h-12 w-12 rounded-lg bg-success/35" />
            <View className="h-16 w-12 rounded-lg bg-success/50" />
          </Space>
        </View>
        <View>
          <Text className="mb-2 text-xs text-muted-foreground">end</Text>
          <Space align="end">
            <View className="h-8 w-12 rounded-lg bg-warning/20" />
            <View className="h-12 w-12 rounded-lg bg-warning/35" />
            <View className="h-16 w-12 rounded-lg bg-warning/50" />
          </Space>
        </View>
        <View>
          <Text className="mb-2 text-xs text-muted-foreground">baseline</Text>
          <Space align="baseline">
            <Text size="xs">Extra small</Text>
            <Text size="lg">Large</Text>
            <Text size="2xl">2XL</Text>
          </Space>
        </View>
      </Space>
    </View>
  );
};

export { SpaceAlign };
