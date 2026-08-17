import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { PopupDemo } from '@/src/demos/PopupDemo';

const PopupPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Popup"
        onLeftPress={() => router.back()}
      />
      <PopupDemo />
    </View>
  );
};

export default PopupPage;
