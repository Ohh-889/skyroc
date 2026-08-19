import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { PaginationDemo } from '@/src/demos/pagination';

const PaginationPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Pagination"
        onLeftPress={() => router.back()}
      />
      <PaginationDemo />
    </View>
  );
};

export default PaginationPage;
