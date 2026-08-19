import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { CheckboxDemo } from '@/src/demos/checkbox';

const CheckboxPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Checkbox"
        onLeftPress={() => router.back()}
      />
      <CheckboxDemo />
    </View>
  );
};

export default CheckboxPage;
