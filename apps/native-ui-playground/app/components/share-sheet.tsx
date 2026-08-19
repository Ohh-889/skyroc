import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { ShareSheetDemo } from '@/src/demos/share-sheet';

const ShareSheetPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="ShareSheet"
        onLeftPress={() => router.back()}
      />
      <ShareSheetDemo />
    </View>
  );
};

export default ShareSheetPage;
