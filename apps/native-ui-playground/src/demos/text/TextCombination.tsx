import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextCombination = () => {
  return (
    <View className="gap-3 rounded-2xl border border-border/70 bg-background p-4">
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
  );
};

export { TextCombination };
