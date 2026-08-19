import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxMultilineLabel = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox defaultChecked>
        A fairly long label that wraps onto more than one line so the control stays aligned with the first line rather
        than the block center.
      </Checkbox>
      <Checkbox>{2024}</Checkbox>
    </View>
  );
};

export { CheckboxMultilineLabel };
