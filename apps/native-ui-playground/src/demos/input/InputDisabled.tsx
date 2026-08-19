import { Input } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 功能按钮在 disabled 下也不响应点击 */
const InputDisabled = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Input
        disabled
        placeholder="disabled"
      />
      <Input
        clearable
        disabled
        defaultValue="disabled 时不显示清除按钮"
      />
      <Input
        disabled
        defaultValue="密码按钮点不动"
        type="password"
      />
    </View>
  );
};

export { InputDisabled };
