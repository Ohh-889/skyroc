import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { NavBarDemo } from '@/src/demos/navbar';

const NavBarPage = () => {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="NavBar"
        onLeftPress={handleBack}
      />
      <NavBarDemo />
    </View>
  );
};

export default NavBarPage;
