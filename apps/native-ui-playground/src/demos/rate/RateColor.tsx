import { Rate, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS: ThemeColor[] = ['warning', 'primary', 'destructive', 'success', 'info', 'accent', 'carbon', 'secondary'];

const RateColor = () => {
  return (
    <View className="gap-3 bg-background p-4">
      {COLORS.map(color => (
        <View
          key={color}
          className="flex-row items-center gap-3"
        >
          <Rate
            color={color}
            defaultValue={4}
            size={20}
          />
          <Text color="muted">{color}</Text>
        </View>
      ))}
    </View>
  );
};

export { RateColor };
