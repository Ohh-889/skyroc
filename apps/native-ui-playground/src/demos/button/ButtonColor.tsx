import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS = ['primary', 'destructive', 'secondary', 'success', 'warning', 'info', 'muted'] as const;

const ButtonColor = () => {
  return (
    <View className="flex-row flex-wrap gap-3 bg-background p-4">
      {COLORS.map(color => (
        <Button
          className="min-w-32 flex-1"
          color={color}
          key={color}
        >
          {color}
        </Button>
      ))}
    </View>
  );
};

export { ButtonColor };
