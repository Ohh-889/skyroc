import { Stepper, Text } from '@skyroc/native-ui';
import type { StepperTheme as StepperThemeToken } from '@skyroc/native-ui';
import { View } from 'react-native';

const THEMES: StepperThemeToken[] = ['default', 'round'];

const StepperTheme = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 gap-3">
        {THEMES.map(theme => (
          <View
            key={theme}
            className="flex-row items-center gap-3"
          >
            <Stepper
              defaultValue={2}
              theme={theme}
            />
            <Text color="muted">{theme}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export { StepperTheme };
