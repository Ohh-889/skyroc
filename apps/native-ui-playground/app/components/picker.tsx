import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { PickerDemo } from '@/src/demos/picker';

const PickerPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="Picker"
        onLeftPress={() => router.back()}
      />
      <PickerDemo />
    </View>
  );
};

export default PickerPage;
