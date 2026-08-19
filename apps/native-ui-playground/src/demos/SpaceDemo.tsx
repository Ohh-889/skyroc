import { Divider, Space, Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';

const SpaceDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 水平方向 */}
      <Text className="mb-4 text-lg font-semibold">水平方向</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space>
          <View className="size-12 items-center justify-center rounded-xl bg-primary/10">
            <Text className="font-semibold text-primary">1</Text>
          </View>
          <View className="size-12 items-center justify-center rounded-xl bg-success/10">
            <Text className="font-semibold text-success">2</Text>
          </View>
          <View className="size-12 items-center justify-center rounded-xl bg-warning/10">
            <Text className="font-semibold text-warning">3</Text>
          </View>
        </Space>
      </View>

      {/* 垂直方向 */}
      <Text className="mb-4 text-lg font-semibold">垂直方向</Text>
      <Text className="mb-3 text-sm text-muted-foreground">direction=&quot;vertical&quot; 让子元素纵向排列</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space
          direction="vertical"
          fill
        >
          <View className="h-11 justify-center rounded-xl bg-primary/10 px-4">
            <Text className="font-medium text-primary">第一项</Text>
          </View>
          <View className="h-11 justify-center rounded-xl bg-success/10 px-4">
            <Text className="font-medium text-success">第二项</Text>
          </View>
          <View className="h-11 justify-center rounded-xl bg-warning/10 px-4">
            <Text className="font-medium text-warning">第三项</Text>
          </View>
        </Space>
      </View>

      {/* 预设间距 */}
      <Text className="mb-4 text-lg font-semibold">预设间距</Text>
      <Text className="mb-3 text-sm text-muted-foreground">支持 xs、sm、md、lg、xl 和 2xl 六档间距</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space
          direction="vertical"
          fill
          size="lg"
        >
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(size => (
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

      {/* 自定义间距 */}
      <Text className="mb-4 text-lg font-semibold">自定义间距</Text>
      <Text className="mb-3 text-sm text-muted-foreground">数值单位为 dp，下面使用 size=20</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space size={20}>
          <View className="size-12 rounded-xl bg-info/15" />
          <View className="size-12 rounded-xl bg-info/30" />
          <View className="size-12 rounded-xl bg-info/50" />
        </Space>
      </View>

      {/* 对齐方式 */}
      <Text className="mb-4 text-lg font-semibold">对齐方式</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
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

      {/* 自动换行 */}
      <Text className="mb-4 text-lg font-semibold">自动换行</Text>
      <Text className="mb-3 text-sm text-muted-foreground">wrap 仅在水平方向生效</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space wrap>
          {Array.from({ length: 10 }, (_, index) => (
            <View
              className="size-11 items-center justify-center rounded-xl bg-primary/10"
              key={index}
            >
              <Text className="text-sm font-medium text-primary">{index + 1}</Text>
            </View>
          ))}
        </Space>
      </View>

      {/* 分隔符 */}
      <Text className="mb-4 text-lg font-semibold">分隔符</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space
          direction="vertical"
          fill
          size="lg"
        >
          <View>
            <Text className="mb-3 text-xs text-muted-foreground">水平排列配合竖向分隔线</Text>
            <Space
              size="sm"
              split={<Divider orientation="vertical" />}
            >
              <Text className="text-sm">编辑</Text>
              <Text className="text-sm">复制</Text>
              <Text className="text-sm text-destructive">删除</Text>
            </Space>
          </View>

          <View>
            <Text className="mb-3 text-xs text-muted-foreground">垂直排列配合横向分隔线</Text>
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
          </View>

          <View>
            <Text className="mb-3 text-xs text-muted-foreground">size=0 时，间距完全由分隔符承担</Text>
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
              <Text className="text-sm text-destructive">删除</Text>
            </Space>
          </View>
        </Space>
      </View>

      {/* 撑满容器 */}
      <Text className="mb-4 text-lg font-semibold">撑满容器</Text>
      <Text className="mb-3 text-sm text-muted-foreground">fill 让 Space 占满父元素宽度</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Space fill>
          <View className="flex-1 items-center justify-center rounded-xl bg-primary/10 py-3">
            <Text className="text-sm font-medium text-primary">左侧</Text>
          </View>
          <View className="flex-1 items-center justify-center rounded-xl bg-success/10 py-3">
            <Text className="text-sm font-medium text-success">右侧</Text>
          </View>
        </Space>
      </View>
    </ScrollView>
  );
};

export { SpaceDemo };
