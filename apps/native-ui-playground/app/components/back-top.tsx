import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { BackTopDemo } from '@/src/demos/back-top';

const BackTopPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="BackTop"
        onLeftPress={() => router.back()}
      />
      <BackTopDemo />
    </View>
  );
};

export default BackTopPage;
