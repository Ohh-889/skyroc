import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { ActionSheetDemo } from '@/src/demos/ActionSheetDemo';

const ActionSheetPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <NavBar
        leftArrow
        title="ActionSheet"
        onLeftPress={() => router.back()}
      />
      <ActionSheetDemo />
    </View>
  );
};

export default ActionSheetPage;
