import { Divider, Space, Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';

const SpaceDemo = () => {
  return (
    <ScrollView className="flex-1 bg-background p-6">
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
        <Space size={20}>
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

      {/* Split */}
      <Text className="mb-4 text-lg font-semibold">Split</Text>
      <View className="mb-8">
        <Space
          direction="vertical"
          fill
        >
          <Text className="text-sm text-muted-foreground">horizontal + 竖向分隔线</Text>
          <Space
            size="sm"
            split={<Divider orientation="vertical" />}
          >
            <Text className="text-sm">编辑</Text>
            <Text className="text-sm">复制</Text>
            <Text className="text-sm">删除</Text>
          </Space>

          <Text className="text-sm text-muted-foreground">vertical + 横向分隔线</Text>
          <Space
            direction="vertical"
            fill
            size="sm"
            split={<Divider />}
          >
            <Text className="text-sm">第一行</Text>
            <Text className="text-sm">第二行</Text>
            <Text className="text-sm">第三行</Text>
          </Space>

          {/* size 为 0 时分隔符两侧不再叠加 gap，间距完全由分隔符自身决定 */}
          <Text className="text-sm text-muted-foreground">size=0，间距只由分隔线承担</Text>
          <Space
            size={0}
            split={
              <Divider
                className="mx-3"
                orientation="vertical"
              />
            }
          >
            <Text className="text-sm">编辑</Text>
            <Text className="text-sm">复制</Text>
            <Text className="text-sm">删除</Text>
          </Space>
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
