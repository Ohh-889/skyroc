import { DatePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const DatePickerColumns = () => {
  return (
    <View className="bg-background p-4">
      <DatePickerView
        columnsType={['year', 'month']}
        showToolbar={false}
        title="选择月份"
      />
    </View>
  );
};

export { DatePickerColumns };
