import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { CalendarDemo } from '@/src/demos/calendar';

const CalendarPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="Calendar"
        onLeftPress={() => router.back()}
      />
      <CalendarDemo />
    </View>
  );
};

export default CalendarPage;
