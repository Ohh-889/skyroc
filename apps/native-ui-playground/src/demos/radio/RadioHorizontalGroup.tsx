import { Radio, RadioGroup } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioHorizontalGroup = () => {
  return (
    <View className="bg-background p-4">
      <RadioGroup
        defaultValue="a"
        direction="horizontal"
      >
        <Radio name="a">A</Radio>
        <Radio name="b">B</Radio>
        <Radio name="c">C</Radio>
        <Radio name="d">D</Radio>
      </RadioGroup>
    </View>
  );
};

export { RadioHorizontalGroup };
