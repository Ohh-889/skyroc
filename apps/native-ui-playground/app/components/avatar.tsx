import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AvatarDemo } from '@/src/demos/AvatarDemo';

const AvatarPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Avatar"
        onLeftPress={() => router.back()}
      />
      <AvatarDemo />
    </View>
  );
};

export default AvatarPage;
