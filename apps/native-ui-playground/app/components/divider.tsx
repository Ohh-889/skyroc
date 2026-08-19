import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { DividerDemo } from '@/src/demos/divider';

const DividerPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Divider"
        onLeftPress={() => router.back()}
      />
      <DividerDemo />
    </View>
  );
};

export default DividerPage;
