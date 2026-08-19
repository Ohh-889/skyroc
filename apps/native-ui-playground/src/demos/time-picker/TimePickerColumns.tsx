import { TimePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const TimePickerColumns = () => {
  return (
    <View className="bg-background px-6 py-4">
      <TimePickerView
        columnsType={['hour', 'minute', 'second']}
        showToolbar={false}
        maxTime="12:00:30"
        minTime="10:00:00"
      />
    </View>
  );
};

export { TimePickerColumns };
