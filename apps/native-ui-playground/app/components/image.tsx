import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { ImageDemo } from '@/src/demos/ImageDemo';

const ImagePage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Image"
        onLeftPress={() => router.back()}
      />
      <ImageDemo />
    </View>
  );
};

export default ImagePage;
