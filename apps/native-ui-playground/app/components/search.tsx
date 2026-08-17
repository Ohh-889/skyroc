import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SearchDemo } from '@/src/demos/SearchDemo';

const SearchPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Search"
        onLeftPress={() => router.back()}
      />
      <SearchDemo />
    </View>
  );
};

export default SearchPage;
