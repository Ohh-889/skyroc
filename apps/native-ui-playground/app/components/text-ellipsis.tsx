import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { TextEllipsisDemo } from '@/src/demos/text-ellipsis';

const TextEllipsisPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="TextEllipsis"
        onLeftPress={() => router.back()}
      />
      <TextEllipsisDemo />
    </View>
  );
};

export default TextEllipsisPage;
