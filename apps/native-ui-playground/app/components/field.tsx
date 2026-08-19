import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { FieldDemo } from '@/src/demos/field';

const FieldPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="Field"
        onLeftPress={() => router.back()}
      />
      <FieldDemo />
    </View>
  );
};

export default FieldPage;
