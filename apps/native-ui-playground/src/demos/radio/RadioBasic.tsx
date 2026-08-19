import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio defaultChecked>Radio</Radio>
      <Radio>Unchecked</Radio>
    </View>
  );
};

export { RadioBasic };
