import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { DialogDemo } from '@/src/demos/DialogDemo';

const DialogPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Dialog"
        onLeftPress={() => router.back()}
      />
      <DialogDemo />
    </View>
  );
};

export default DialogPage;
