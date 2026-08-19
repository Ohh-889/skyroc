import { PasswordInput, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 组件默认数字键盘 + 不自动大写，两者都排在 rest 之前，可以被逐项覆盖 */
const PasswordInputNativeProps = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        autoCapitalize="characters"
        keyboardType="default"
        mask={false}
        variant="separated"
      />
      <Text className="text-sm text-muted-foreground">覆盖默认值后可输入字母并自动大写</Text>
      <PasswordInput
        defaultValue="123"
        editable={false}
      />
      <Text className="text-sm text-muted-foreground">editable=false 时保留展示，但不可编辑</Text>
    </View>
  );
};

export { PasswordInputNativeProps };
