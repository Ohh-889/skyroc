import { Input } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 透传给底层 TextInput 的原生属性 */
const InputNativeProps = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Input
        keyboardType="email-address"
        placeholder="email-address 键盘"
      />
      <Input
        maxLength={6}
        placeholder="maxLength=6"
      />
      <Input
        multiline
        className="h-24 items-start py-2"
        placeholder="multiline"
      />
    </View>
  );
};

export { InputNativeProps };
