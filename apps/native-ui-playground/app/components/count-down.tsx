import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { CountDownDemo } from '@/src/demos/CountDownDemo';

const CountDownPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="CountDown"
        onLeftPress={() => router.back()}
      />
      <CountDownDemo />
    </View>
  );
};

export default CountDownPage;
