import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { DropdownMenuDemo } from '@/src/demos/DropdownMenuDemo';

const DropdownMenuPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="DropdownMenu"
        onLeftPress={() => router.back()}
      />
      <DropdownMenuDemo />
    </View>
  );
};

export default DropdownMenuPage;
