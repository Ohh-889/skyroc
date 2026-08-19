import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxDisabled = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox
        defaultChecked
        disabled
      >
        Disabled & Checked
      </Checkbox>
    </View>
  );
};

export { CheckboxDisabled };
