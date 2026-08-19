import { Stepper } from '@skyroc/native-ui';
import { View } from 'react-native';

const StepperStyles = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        <Stepper
          className="self-start rounded-lg bg-secondary p-2"
          defaultValue={2}
        />
        <Stepper
          classNames={{
            input: 'bg-transparent text-primary',
            minus: 'rounded-full bg-primary-100',
            minusIcon: 'text-primary',
            plus: 'rounded-full bg-primary',
            plusIcon: 'text-primary-foreground',
            root: 'gap-2'
          }}
          defaultValue={2}
        />
      </View>
    </View>
  );
};

export { StepperStyles };
