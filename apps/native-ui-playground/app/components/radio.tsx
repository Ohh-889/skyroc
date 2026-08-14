import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { RadioDemo } from '@/src/demos/RadioDemo';

const RadioPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Radio"
        onLeftPress={() => router.back()}
      />
      <RadioDemo />
    </View>
  );
};

export default RadioPage;
