import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SliderDemo } from '@/src/demos/SliderDemo';

const SliderPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Slider"
        onLeftPress={() => router.back()}
      />
      <SliderDemo />
    </View>
  );
};

export default SliderPage;
