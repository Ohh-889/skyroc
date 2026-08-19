import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextColor = () => {
  return (
    <View className="gap-3 rounded-2xl border border-border/70 bg-background p-4">
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
  );
};

export { TextColor };
