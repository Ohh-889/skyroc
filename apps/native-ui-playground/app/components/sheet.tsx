import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SheetDemo } from '@/src/demos/SheetDemo';

const SheetPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-red-50">
      <NavBar
        leftArrow
        title="Sheet"
        onLeftPress={() => router.back()}
      />
      <SheetDemo />
    </View>
  );
};

export default SheetPage;
