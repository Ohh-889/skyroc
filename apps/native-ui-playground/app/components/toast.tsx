import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { ToastDemo } from '@/src/demos/ToastDemo';

const ToastPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Toast"
        onLeftPress={() => router.back()}
      />
      <ToastDemo />
    </View>
  );
};

export default ToastPage;
