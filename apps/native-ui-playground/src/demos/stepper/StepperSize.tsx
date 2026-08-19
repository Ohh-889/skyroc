import { Stepper, Text } from '@skyroc/native-ui';
import type { StepperSize as StepperSizeToken } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES: StepperSizeToken[] = ['sm', 'md', 'lg'];

const StepperSize = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        {SIZES.map(size => (
          <View
            key={size}
            className="flex-row items-center gap-3"
          >
            <Stepper
              defaultValue={2}
              size={size}
            />
            <Text color="muted">{size}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export { StepperSize };
