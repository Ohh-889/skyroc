import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { PickerGroupDemo } from '@/src/demos/picker-group';

const PickerGroupPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="PickerGroup"
        onLeftPress={() => router.back()}
      />
      <PickerGroupDemo />
    </View>
  );
};

export default PickerGroupPage;
