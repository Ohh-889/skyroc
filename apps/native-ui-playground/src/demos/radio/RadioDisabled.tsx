import { Radio } from '@skyroc/native-ui';
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
    </View>
  );
};

export { RadioDisabled };
