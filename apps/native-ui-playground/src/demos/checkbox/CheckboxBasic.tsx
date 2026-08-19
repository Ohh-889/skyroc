import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox defaultChecked>Checkbox</Checkbox>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox checked="indeterminate">Indeterminate</Checkbox>
    </View>
  );
};

export { CheckboxBasic };
