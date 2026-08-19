import { Switch, Text } from '@skyroc/native-ui';
import type { ThemeSize } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const SwitchSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {SIZES.map(size => (
        <View
          key={size}
          className="flex-row items-center gap-3"
        >
          <Switch
            defaultChecked
            size={size}
          />
          <Text color="muted">{size}</Text>
        </View>
      ))}
    </View>
  );
};

export { SwitchSize };
