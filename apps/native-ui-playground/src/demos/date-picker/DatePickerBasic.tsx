import { DatePickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const DatePickerBasic = () => {
  return (
    <View className="bg-background p-4">
      <DatePickerView showToolbar={false} />
    </View>
  );
};

export { DatePickerBasic };
