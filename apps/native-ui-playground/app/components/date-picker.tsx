import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { DatePickerDemo } from '@/src/demos/date-picker';

const DatePickerPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="DatePicker"
        onLeftPress={() => router.back()}
      />
      <DatePickerDemo />
    </View>
  );
};

export default DatePickerPage;
