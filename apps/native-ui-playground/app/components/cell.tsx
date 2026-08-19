import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { NavBar } from '@skyroc/native-ui';
import { CellDemo } from '@/src/demos/cell';

const CellPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Cell"
        onLeftPress={() => router.back()}
      />
      <CellDemo />
    </View>
  );
};

export default CellPage;
