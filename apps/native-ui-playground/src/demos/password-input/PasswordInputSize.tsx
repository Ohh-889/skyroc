import { PasswordInput, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['sm', 'md', 'lg'] as const;

/** size 同时驱动格子高度、掩码圆点尺寸与明文字号 */
const PasswordInputSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIZES.map(s => (
        <PasswordInput
          defaultValue="1234"
          key={s}
          size={s}
        />
      ))}
      <Text className="text-sm text-muted-foreground">圆点大小随 size 变化，不只是格子变高</Text>
    </View>
  );
};

export { PasswordInputSize };
