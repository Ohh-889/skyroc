import { Stepper, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const StepperEmpty = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            allowEmpty
            defaultValue={2}
            min={0}
          />
          <Text color="muted">allowEmpty</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            autoFixed={false}
            defaultValue={2}
            max={9}
            min={1}
          />
          <Text color="muted">autoFixed=false</Text>
        </View>
      </View>
    </View>
  );
};

export { StepperEmpty };
