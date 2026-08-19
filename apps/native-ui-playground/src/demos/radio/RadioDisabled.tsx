import { Radio, RadioGroup } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioDisabled = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio disabled>Disabled</Radio>
      <Radio
        defaultChecked
        disabled
      >
        Disabled & Checked
      </Radio>
      <RadioGroup
        disabled
        defaultValue="a"
      >
        <Radio name="a">整组禁用：已选</Radio>
        <Radio name="b">整组禁用：未选</Radio>
      </RadioGroup>
    </View>
  );
};

export { RadioDisabled };
