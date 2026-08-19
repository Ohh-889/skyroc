import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TimePickerDemo } from '@/src/demos/time-picker';

const TimePickerPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="TimePicker"
        onLeftPress={() => router.back()}
      />
      <TimePickerDemo />
    </View>
  );
};

export default TimePickerPage;
