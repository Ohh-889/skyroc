import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextWeight = () => {
  return (
    <View className="gap-3 rounded-2xl border border-border/70 bg-background p-4">
      <Text weight="normal">Normal · 常规正文</Text>
      <Text weight="medium">Medium · 中等强调</Text>
      <Text weight="semibold">Semibold · 次级标题</Text>
      <Text weight="bold">Bold · 重点标题</Text>
    </View>
  );
};

export { TextWeight };
