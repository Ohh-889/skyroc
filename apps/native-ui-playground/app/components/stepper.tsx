import { NavBar } from '@skyroc/native-ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { StepperDemo } from '@/src/demos/StepperDemo';

const StepperPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <NavBar
        leftArrow
        title="Stepper"
        onLeftPress={() => router.back()}
      />
      <StepperDemo />
    </View>
  );
};

export default StepperPage;
