import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioShape = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio
        defaultChecked
        shape="round"
      >
        Round (default)
      </Radio>
      <Radio
        defaultChecked
        shape="square"
      >
        Square
      </Radio>
    </View>
  );
};

export { RadioShape };
