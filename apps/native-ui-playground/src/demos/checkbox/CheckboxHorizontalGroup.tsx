import { Checkbox, CheckboxGroup } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxHorizontalGroup = () => {
  return (
    <View className="bg-background p-4">
      <CheckboxGroup
        defaultValue={['a']}
        direction="horizontal"
      >
        <Checkbox name="a">A</Checkbox>
        <Checkbox name="b">B</Checkbox>
        <Checkbox name="c">C</Checkbox>
        <Checkbox name="d">D</Checkbox>
      </CheckboxGroup>
    </View>
  );
};

export { CheckboxHorizontalGroup };
