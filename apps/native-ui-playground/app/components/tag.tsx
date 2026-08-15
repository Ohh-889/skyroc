import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { NavBar } from '@skyroc/native-ui';
import { TagDemo } from '@/src/demos/TagDemo';

const TagPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Tag"
        onLeftPress={() => router.back()}
      />
      <TagDemo />
    </View>
  );
};

export default TagPage;
