import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const CheckboxSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIZES.map(s => (
        <Checkbox
          key={s}
          defaultChecked
          size={s}
        >
          {s}
        </Checkbox>
      ))}
    </View>
  );
};

export { CheckboxSize };
