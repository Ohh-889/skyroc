import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxLabelPosition = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox labelPosition="right">Label on right</Checkbox>
      <Checkbox labelPosition="left">Label on left</Checkbox>
      <Checkbox labelDisabled>Label not pressable (labelDisabled)</Checkbox>
    </View>
  );
};

export { CheckboxLabelPosition };
