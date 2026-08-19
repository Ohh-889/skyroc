import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { InputDemo } from '@/src/demos/input';

const InputPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Input"
        onLeftPress={() => router.back()}
      />
      <InputDemo />
    </View>
  );
};

export default InputPage;
