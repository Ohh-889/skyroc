import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioLabelPosition = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio labelPosition="right">Label on right</Radio>
      <Radio labelPosition="left">Label on left</Radio>
    </View>
  );
};

export { RadioLabelPosition };
