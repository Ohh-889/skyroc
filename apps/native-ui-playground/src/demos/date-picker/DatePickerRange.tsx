import { DatePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const CURRENT_YEAR = new Date().getFullYear();

const DatePickerRange = () => {
  return (
    <View className="bg-background p-4">
      <DatePickerView
        showToolbar={false}
        maxDate={new Date(CURRENT_YEAR, 11, 20)}
        minDate={new Date(CURRENT_YEAR, 0, 10)}
      />
    </View>
  );
};

export { DatePickerRange };
