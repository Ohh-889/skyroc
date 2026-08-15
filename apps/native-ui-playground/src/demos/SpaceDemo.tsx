import { ScrollView, View } from 'react-native';
import { Space, Text } from '@skyroc/native-ui';

const SpaceDemo = () => {
  return (
    <ScrollView className="flex-1 bg-#000 p-6">
      {/* Horizontal */}
      <Text className="mb-4 text-lg font-semibold">Horizontal</Text>
      <View className="mb-8">
        <Space>
          <View className="size-12 items-center justify-center rounded-md bg-primary">
            <Text className="text-sm text-primary-foreground">1</Text>
          </View>
          <View className="size-12 items-center justify-center rounded-md bg-primary">
            <Text className="text-sm text-primary-foreground">2</Text>
          </View>
          <View className="size-12 items-center justify-center rounded-md bg-primary">
            <Text className="text-sm text-primary-foreground">3</Text>
          </View>
        </Space>
      </View>

      {/* Vertical */}
      <Text className="mb-4 text-lg font-semibold">Vertical</Text>
      <View className="mb-8">
        <Space
          direction="vertical"
          fill
        >
          <View className="h-10 items-center justify-center rounded-md bg-primary">
            <Text className="text-sm text-primary-foreground">Item 1</Text>
          </View>
          <View className="h-10 items-center justify-center rounded-md bg-primary">
            <Text className="text-sm text-primary-foreground">Item 2</Text>
          </View>
          <View className="h-10 items-center justify-center rounded-md bg-primary">
            <Text className="text-sm text-primary-foreground">Item 3</Text>
          </View>
        </Space>
      </View>

      {/* Sizes */}
      <Text className="mb-4 text-lg font-semibold">Sizes</Text>
      <View className="mb-8">
        <Space
          direction="vertical"
          fill
        >
          <Text className="text-sm text-muted-foreground">xs</Text>
          <Space size="xs">
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
          </Space>

          <Text className="text-sm text-muted-foreground">sm</Text>
          <Space size="sm">
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
          </Space>

          <Text className="text-sm text-muted-foreground">md (default)</Text>
          <Space size="md">
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
          </Space>

          <Text className="text-sm text-muted-foreground">lg</Text>
          <Space size="lg">
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
          </Space>

          <Text className="text-sm text-muted-foreground">xl</Text>
          <Space size="xl">
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
            <View className="size-10 rounded-md bg-secondary" />
          </Space>
        </Space>
      </View>

      {/* Custom Size */}
      <Text className="mb-4 text-lg font-semibold">Custom Size (20px)</Text>
      <View className="mb-8">
        <Space>
          <View className="size-12 rounded-md bg-primary" />
          <View className="size-12 rounded-md bg-primary" />
          <View className="size-12 rounded-md bg-primary" />
        </Space>
      </View>

      {/* Align */}
      <Text className="mb-4 text-lg font-semibold">Align</Text>
      <View className="mb-8">
        <Space
          direction="vertical"
          fill
        >
          <Text className="text-sm text-muted-foreground">center</Text>
          <Space align="center">
            <View className="h-8 w-12 rounded-md bg-primary" />
            <View className="h-12 w-12 rounded-md bg-primary" />
            <View className="h-16 w-12 rounded-md bg-primary" />
          </Space>

          <Text className="text-sm text-muted-foreground">start</Text>
          <Space align="start">
            <View className="h-8 w-12 rounded-md bg-secondary" />
            <View className="h-12 w-12 rounded-md bg-secondary" />
            <View className="h-16 w-12 rounded-md bg-secondary" />
          </Space>

          <Text className="text-sm text-muted-foreground">end</Text>
          <Space align="end">
            <View className="h-8 w-12 rounded-md bg-primary" />
            <View className="h-12 w-12 rounded-md bg-primary" />
            <View className="h-16 w-12 rounded-md bg-primary" />
          </Space>
        </Space>
      </View>

      {/* Wrap */}
      <Text className="mb-4 text-lg font-semibold">Wrap</Text>
      <View className="mb-8">
        <Space wrap>
          {Array.from({ length: 10 }, (_, i) => (
            <View
              key={i}
              className="size-12 items-center justify-center rounded-md bg-primary"
            >
              <Text className="text-sm text-primary-foreground">{i + 1}</Text>
            </View>
          ))}
        </Space>
      </View>

      {/* Fill */}
      <Text className="mb-4 text-lg font-semibold">Fill</Text>
      <View className="mb-8">
        <Space fill>
          <View className="flex-1 items-center justify-center rounded-md bg-primary py-3">
            <Text className="text-sm text-primary-foreground">Left</Text>
          </View>
          <View className="flex-1 items-center justify-center rounded-md bg-secondary py-3">
            <Text className="text-sm text-secondary-foreground">Right</Text>
          </View>
        </Space>
      </View>
    </ScrollView>
  );
};

export { SpaceDemo };
