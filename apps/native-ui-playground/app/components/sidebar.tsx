import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { SidebarDemo } from '@/src/demos/SidebarDemo';

const SidebarPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Sidebar"
        onLeftPress={() => router.back()}
      />
      <SidebarDemo />
    </View>
  );
};

export default SidebarPage;
