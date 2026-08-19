import { Input } from '@skyroc/native-ui';
import { View } from 'react-native';

const InputBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Input placeholder="请输入" />
      <Input defaultValue="非受控默认值" />
    </View>
  );
};

export { InputBasic };
