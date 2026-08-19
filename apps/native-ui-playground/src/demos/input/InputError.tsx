import { Input, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const VARIANTS = ['outline', 'filled', 'underline', 'none'] as const;

/** error 在未聚焦时同样是红框：边框色走 compoundVariants，不会被 variant 的边框覆盖 */
const InputError = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {VARIANTS.map(v => (
        <Input
          error
          key={v}
          placeholder={`${v} + error`}
          variant={v}
        />
      ))}
      <Text className="text-sm text-muted-foreground">聚焦后仍保持红色，错误态优先级高于聚焦色</Text>
    </View>
  );
};

export { InputError };
