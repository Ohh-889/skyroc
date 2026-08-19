import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { ButtonDemo } from '@/src/demos/button';

const ButtonPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Button"
        onLeftPress={() => router.back()}
      />
      <ButtonDemo />
    </View>
  );
};

export default ButtonPage;
