import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio defaultChecked>默认选中</Radio>
      <Radio>未选中</Radio>
    </View>
  );
};

export { RadioBasic };
