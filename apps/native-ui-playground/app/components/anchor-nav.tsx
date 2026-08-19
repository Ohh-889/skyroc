import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AnchorNavDemo } from '@/src/demos/anchor-nav';

const AnchorNavPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="AnchorNav"
        onLeftPress={() => router.back()}
      />
      <AnchorNavDemo />
    </View>
  );
};

export default AnchorNavPage;
