import { Slider, Text } from '@skyroc/native-ui';
import type { ThemeColor } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS: ThemeColor[] = ['primary', 'success', 'warning', 'destructive', 'info', 'accent', 'carbon', 'secondary'];

const SliderColor = () => {
  return (
    <View className="gap-4 bg-background px-6 py-4">
      {COLORS.map(color => (
        <View
          key={color}
          className="flex-row items-center gap-4"
        >
          <View className="flex-1">
            <Slider
              color={color}
              defaultValue={60}
            />
          </View>
          <Text
            className="w-20"
            color="muted"
          >
            {color}
          </Text>
        </View>
      ))}
    </View>
  );
};

export { SliderColor };
