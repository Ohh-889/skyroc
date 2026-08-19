import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { GridDemo } from '@/src/demos/grid';

const GridPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Grid"
        onLeftPress={() => router.back()}
      />
      <GridDemo />
    </View>
  );
};

export default GridPage;
