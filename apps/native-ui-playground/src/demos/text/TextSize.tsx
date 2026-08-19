import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextSize = () => {
  return (
    <View className="gap-2 rounded-2xl border border-border/70 bg-background p-4">
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
  );
};

export { TextSize };
