import { TimePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const TimePickerLimit = () => {
  return (
    <View className="bg-background px-6 py-4">
      <TimePickerView
        showToolbar={false}
        defaultValue={['08', '00']}
        maxTime="18:15:00"
        minTime="09:30:00"
      />
    </View>
  );
};

export { TimePickerLimit };
