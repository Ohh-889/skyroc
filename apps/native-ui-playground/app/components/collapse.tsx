import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { CollapseDemo } from '@/src/demos/CollapseDemo';

const CollapsePage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Collapse"
        onLeftPress={() => router.back()}
      />
      <CollapseDemo />
    </View>
  );
};

export default CollapsePage;
