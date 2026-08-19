import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { NumberKeyboardDemo } from '@/src/demos/number-keyboard';

const NumberKeyboardPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="NumberKeyboard"
        onLeftPress={() => router.back()}
      />
      <NumberKeyboardDemo />
    </View>
  );
};

export default NumberKeyboardPage;
