import { PasswordInput, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** merged 靠外框描边 + 内部左边框分隔，separated 每格独立描边并由 gutter 拉开间距 */
const PasswordInputVariant = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput defaultValue="12" />
      <Text className="text-sm text-muted-foreground">merged（默认），gutter 不生效</Text>
      <PasswordInput
        defaultValue="12"
        variant="separated"
      />
      <Text className="text-sm text-muted-foreground">separated，默认 gutter=12</Text>
      <PasswordInput
        defaultValue="12"
        gutter={4}
        variant="separated"
      />
      <Text className="text-sm text-muted-foreground">separated + gutter=4</Text>
    </View>
  );
};

export { PasswordInputVariant };
