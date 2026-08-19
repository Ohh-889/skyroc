import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxShape = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox
        defaultChecked
        shape="round"
      >
        Round (default)
      </Checkbox>
      <Checkbox
        defaultChecked
        shape="square"
      >
        Square
      </Checkbox>
    </View>
  );
};

export { CheckboxShape };
