import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { BadgeDemo } from '@/src/demos/badge';

const BadgePage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Badge"
        onLeftPress={() => router.back()}
      />
      <BadgeDemo />
    </View>
  );
};

export default BadgePage;
