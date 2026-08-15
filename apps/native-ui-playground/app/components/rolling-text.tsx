import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { RollingTextDemo } from '@/src/demos/RollingTextDemo';

const RollingTextPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="RollingText"
        onLeftPress={() => router.back()}
      />
      <RollingTextDemo />
    </View>
  );
};

export default RollingTextPage;
