import { DatePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const DatePickerColumns = () => {
  return (
    <View className="bg-background p-4">
      <DatePickerView
        columnsType={['month', 'day']}
        defaultValue={['08', '19']}
        showToolbar={false}
      />
    </View>
  );
};

export { DatePickerColumns };
