import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextNativeProps = () => {
  return (
    <View className="rounded-2xl border border-border/70 bg-background p-4">
      <Text
        className="max-w-64"
        numberOfLines={1}
      >
        这是一段会在单行末尾自动省略的较长文字，用于验证 numberOfLines 属性。
      </Text>
    </View>
  );
};

export { TextNativeProps };
