import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TextDemo } from '@/src/demos/text';

const TextPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Text"
        onLeftPress={() => router.back()}
      />
      <TextDemo />
    </View>
  );
};

export default TextPage;
