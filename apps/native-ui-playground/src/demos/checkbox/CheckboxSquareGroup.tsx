import { Checkbox, CheckboxGroup } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxSquareGroup = () => {
  return (
    <View className="bg-background p-4">
      <CheckboxGroup
        color="warning"
        defaultValue={['x']}
        shape="square"
      >
        <Checkbox name="x">X</Checkbox>
        <Checkbox name="y">Y</Checkbox>
        <Checkbox name="z">Z</Checkbox>
      </CheckboxGroup>
    </View>
  );
};

export { CheckboxSquareGroup };
