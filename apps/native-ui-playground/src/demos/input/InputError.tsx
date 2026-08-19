import { Input, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const BORDER_VARIANTS = ['outline', 'filled', 'underline'] as const;

/** Error 只覆盖有边框的变体；none 没有自身边框，需要由外层布局呈现错误反馈 */
const InputError = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {BORDER_VARIANTS.map(variant => (
        <Input
          error
          key={variant}
          placeholder={`${variant} + error`}
          variant={variant}
        />
      ))}
      <View className="rounded-lg border border-destructive px-3 py-2">
        <Input
          error
          placeholder="none 由父容器呈现错误边界"
          variant="none"
        />
      </View>
      <Text className="text-sm text-muted-foreground">
        outline、filled、underline 聚焦后仍保持红框；none 始终无自身边框
      </Text>
    </View>
  );
};

export { InputError };
