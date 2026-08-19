import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextBasic = () => {
  return (
    <View className="bg-background p-4">
      <Text>Text 提供统一的主题颜色、字号与字重。</Text>
      <Text className="mt-2 text-sm text-muted-foreground">未传变体属性时使用正文默认样式。</Text>
    </View>
  );
};

export { TextBasic };
