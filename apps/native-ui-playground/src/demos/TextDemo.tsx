import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';

const TextDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Text>Text 提供统一的主题颜色、字号与字重。</Text>
        <Text className="mt-2 text-sm text-muted-foreground">未传变体属性时使用正文默认样式。</Text>
      </View>

      {/* 字号 */}
      <Text className="mb-4 text-lg font-semibold">字号</Text>
      <Text className="mb-3 text-sm text-muted-foreground">从 4xs 到 4xl 共十二档字号</Text>
      <View className="mb-8 gap-2 rounded-2xl border border-border/70 bg-background p-4">
        <Text size="4xs">4xs · 辅助标记</Text>
        <Text size="3xs">3xs · 微型文字</Text>
        <Text size="2xs">2xs · 紧凑说明</Text>
        <Text size="xs">xs · 辅助信息</Text>
        <Text size="sm">sm · 次要正文</Text>
        <Text size="md">md · 默认正文</Text>
        <Text size="base">base · 基础字号（与 md 相同）</Text>
        <Text size="lg">lg · 强调正文</Text>
        <Text size="xl">xl · 小标题</Text>
        <Text size="2xl">2xl · 区块标题</Text>
        <Text size="3xl">3xl · 页面标题</Text>
        <Text size="4xl">4xl · 展示标题</Text>
      </View>

      {/* 字重 */}
      <Text className="mb-4 text-lg font-semibold">字重</Text>
      <View className="mb-8 gap-3 rounded-2xl border border-border/70 bg-background p-4">
        <Text weight="normal">Normal · 常规正文</Text>
        <Text weight="medium">Medium · 中等强调</Text>
        <Text weight="semibold">Semibold · 次级标题</Text>
        <Text weight="bold">Bold · 重点标题</Text>
      </View>

      {/* 语义色 */}
      <Text className="mb-4 text-lg font-semibold">语义色</Text>
      <Text className="mb-3 text-sm text-muted-foreground">颜色随当前主题自动切换</Text>
      <View className="mb-8 gap-3 rounded-2xl border border-border/70 bg-background p-4">
        <Text color="foreground">Foreground · 默认前景色</Text>
        <Text color="muted">Muted · 次要信息</Text>
        <Text color="primary">Primary · 品牌强调</Text>
        <Text color="secondary">Secondary · 次级内容</Text>
        <Text color="success">Success · 成功状态</Text>
        <Text color="warning">Warning · 警告状态</Text>
        <Text color="destructive">Destructive · 危险状态</Text>
        <Text color="info">Info · 信息状态</Text>
        <Text color="accent">Accent · 强调内容</Text>
      </View>

      {/* 组合变体 */}
      <Text className="mb-4 text-lg font-semibold">组合变体</Text>
      <Text className="mb-3 text-sm text-muted-foreground">size、weight 与 color 可以组合使用</Text>
      <View className="mb-8 gap-3 rounded-2xl border border-border/70 bg-background p-4">
        <Text
          color="primary"
          size="2xl"
          weight="bold"
        >
          重要数据 86%
        </Text>
        <Text
          color="success"
          size="sm"
          weight="medium"
        >
          较上周提升 12%
        </Text>
      </View>

      {/* className 覆盖 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text className="mb-3 text-sm text-muted-foreground">className 的优先级高于变体属性</Text>
      <View className="mb-8 gap-3 rounded-2xl border border-border/70 bg-background p-4">
        <Text
          className="text-warning"
          color="primary"
        >
          color 设置为 primary，className 覆盖为 warning
        </Text>
        <Text className="text-xl font-bold tracking-wide text-info">通过 className 自定义字号、字重与字距</Text>
      </View>

      {/* React Native Text 属性 */}
      <Text className="mb-4 text-lg font-semibold">原生文字属性</Text>
      <Text className="mb-3 text-sm text-muted-foreground">支持 numberOfLines 等 React Native Text 属性</Text>
      <View className="mb-8 rounded-2xl border border-border/70 bg-background p-4">
        <Text
          className="max-w-64"
          numberOfLines={1}
        >
          这是一段会在单行末尾自动省略的较长文字，用于验证 numberOfLines 属性。
        </Text>
      </View>
    </ScrollView>
  );
};

export { TextDemo };
