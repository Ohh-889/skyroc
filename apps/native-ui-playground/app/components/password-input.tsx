import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { PasswordInputDemo } from '@/src/demos/PasswordInputDemo';

const PasswordInputPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="PasswordInput"
        onLeftPress={() => router.back()}
      />
      <PasswordInputDemo />
    </View>
  );
};

export default PasswordInputPage;
