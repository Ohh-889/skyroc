import { Radio, RadioGroup } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioSquareGroup = () => {
  return (
    <View className="bg-background p-4">
      <RadioGroup
        color="warning"
        defaultValue="x"
        shape="square"
      >
        <Radio name="x">X</Radio>
        <Radio name="y">Y</Radio>
        <Radio name="z">Z</Radio>
      </RadioGroup>
    </View>
  );
};

export { RadioSquareGroup };
