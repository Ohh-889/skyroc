import { Switch, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS: ThemeColor[] = ['primary', 'success', 'warning', 'destructive', 'info', 'accent', 'carbon', 'secondary'];

const SwitchColor = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {COLORS.map(color => (
        <View
          key={color}
          className="flex-row items-center gap-3"
        >
          <Switch
            defaultChecked
            color={color}
          />
          <Text color="muted">{color}</Text>
        </View>
      ))}
    </View>
  );
};

export { SwitchColor };
