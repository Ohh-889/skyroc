import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { FormDemo } from '@/src/demos/FormDemo';

const FormPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="Form"
        onLeftPress={() => router.back()}
      />
      <FormDemo />
    </View>
  );
};

export default FormPage;
