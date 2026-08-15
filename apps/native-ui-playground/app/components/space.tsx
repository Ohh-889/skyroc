import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { NavBar } from '@skyroc/native-ui';
import { SpaceDemo } from '@/src/demos/SpaceDemo';

const SpacePage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Space"
        onLeftPress={() => router.back()}
      />
      <SpaceDemo />
    </View>
  );
};

export default SpacePage;
