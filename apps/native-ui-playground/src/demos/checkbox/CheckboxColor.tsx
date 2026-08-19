import { Checkbox, CheckboxGroup } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS = ['primary', 'destructive', 'success', 'warning', 'info', 'accent', 'carbon', 'secondary'];

const CheckboxColor = () => {
  return (
    <View className="gap-4 bg-background p-4">
      {COLORS.map(c => (
        <CheckboxGroup
          color={c as ThemeColor}
          defaultValue={['a']}
          direction="horizontal"
          key={c}
        >
          <Checkbox name="a">{c}</Checkbox>
          <Checkbox name="b">B</Checkbox>
        </CheckboxGroup>
      ))}
    </View>
  );
};

export { CheckboxColor };
