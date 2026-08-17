import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { NotifyDemo } from '@/src/demos/NotifyDemo';

const NotifyPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Notify"
        onLeftPress={() => router.back()}
      />
      <NotifyDemo />
    </View>
  );
};

export default NotifyPage;
