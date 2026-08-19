import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { IndexBarDemo } from '@/src/demos/index-bar';

const IndexBarPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="IndexBar"
        onLeftPress={() => router.back()}
      />
      <IndexBarDemo />
    </View>
  );
};

export default IndexBarPage;
