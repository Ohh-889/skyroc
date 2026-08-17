import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TreeSelectDemo } from '@/src/demos/TreeSelectDemo';

const TreeSelectPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="TreeSelect"
        onLeftPress={() => router.back()}
      />
      <TreeSelectDemo />
    </View>
  );
};

export default TreeSelectPage;
