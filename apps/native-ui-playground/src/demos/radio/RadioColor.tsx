import { Radio, RadioGroup } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/ui-types';
import { View } from 'react-native';

const COLORS: ThemeColor[] = ['primary', 'destructive', 'success', 'warning', 'info', 'accent', 'carbon', 'secondary'];

const RadioColor = () => {
  return (
    <View className="gap-4 bg-background p-4">
      {COLORS.map(c => (
        <RadioGroup
          color={c}
          defaultValue="a"
          direction="horizontal"
          key={c}
        >
          <Radio name="a">{c}</Radio>
          <Radio name="b">B</Radio>
        </RadioGroup>
      ))}
    </View>
  );
};

export { RadioColor };
