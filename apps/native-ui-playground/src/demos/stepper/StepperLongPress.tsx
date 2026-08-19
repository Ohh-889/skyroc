import { Stepper, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const StepperLongPress = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={10}
            max={999}
          />
          <Text color="muted">默认开启</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Stepper
            defaultValue={10}
            longPress={false}
            max={999}
          />
          <Text color="muted">longPress=false</Text>
        </View>
      </View>
    </View>
  );
};

export { StepperLongPress };
