import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { RateDemo } from '@/src/demos/RateDemo';

const RatePage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Rate"
        onLeftPress={() => router.back()}
      />
      <RateDemo />
    </View>
  );
};

export default RatePage;
