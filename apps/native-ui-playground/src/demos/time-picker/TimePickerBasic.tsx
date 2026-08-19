import { TimePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const TimePickerBasic = () => {
  return (
    <View className="bg-background px-6 py-4">
      <TimePickerView showToolbar={false} />
    </View>
  );
};

export { TimePickerBasic };
