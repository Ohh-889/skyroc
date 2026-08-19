import { Stepper, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const StepperVisibility = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={2}
            showInput={false}
          />
          <Text color="muted">showInput=false</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={2}
            showMinus={false}
          />
          <Text color="muted">showMinus=false</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={2}
            showPlus={false}
          />
          <Text color="muted">showPlus=false</Text>
        </View>
      </View>
    </View>
  );
};

export { StepperVisibility };
