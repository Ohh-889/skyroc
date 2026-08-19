import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TabsDemo } from '@/src/demos/tabs';

const TabsPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Tabs"
        onLeftPress={() => router.back()}
      />
      <TabsDemo />
    </View>
  );
};

export default TabsPage;
