import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { FloatingButtonDemo } from '@/src/demos/floating-button';

const FloatingButtonPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="FloatingButton"
        onLeftPress={() => router.back()}
      />
      <FloatingButtonDemo />
    </View>
  );
};

export default FloatingButtonPage;
