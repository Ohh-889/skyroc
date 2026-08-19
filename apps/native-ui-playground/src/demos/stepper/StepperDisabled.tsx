import { Stepper, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const StepperDisabled = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            disabled
            defaultValue={2}
          />
          <Text color="muted">disabled</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            disableInput
            defaultValue={2}
          />
          <Text color="muted">disableInput</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            disableMinus
            defaultValue={2}
          />
          <Text color="muted">disableMinus</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            disablePlus
            defaultValue={2}
          />
          <Text color="muted">disablePlus</Text>
        </View>
      </View>
    </View>
  );
};

export { StepperDisabled };
