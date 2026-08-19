import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SignatureDemo } from '@/src/demos/signature';

const SignaturePage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Signature"
        onLeftPress={() => router.back()}
      />
      <SignatureDemo />
    </View>
  );
};

export default SignaturePage;
