import { PasswordInput, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['sm', 'md', 'lg'] as const;

/** Size 同时驱动格子高度、掩码圆点尺寸与明文字号 */
const PasswordInputSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIZES.map(s => (
        <View
          key={s}
          className="gap-2"
        >
          <Text className="text-sm font-medium text-foreground">size=&quot;{s}&quot;</Text>
          <PasswordInput
            defaultValue="1234"
            size={s}
          />
        </View>
      ))}
      <Text className="text-sm text-muted-foreground">圆点大小随 size 变化，不只是格子变高</Text>
    </View>
  );
};

export { PasswordInputSize };
