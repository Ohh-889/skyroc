import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const RadioSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIZES.map(s => (
        <Radio
          key={s}
          defaultChecked
          size={s}
        >
          {s}
        </Radio>
      ))}
    </View>
  );
};

export { RadioSize };
