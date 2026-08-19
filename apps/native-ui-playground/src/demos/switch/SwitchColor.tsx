import { Switch, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS: ThemeColor[] = ['primary', 'success', 'warning', 'destructive', 'info', 'accent', 'carbon', 'secondary'];

const SwitchColor = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
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
    </View>
  );
};

export { SwitchColor };
