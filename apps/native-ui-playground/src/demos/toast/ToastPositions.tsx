import type { ToastPosition } from '@skyroc/native-ui';
import { Button, showToast } from '@skyroc/native-ui';
import { View } from 'react-native';

const POSITIONS: ToastPosition[] = ['top', 'middle', 'bottom'];

const ToastPositions = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
      {POSITIONS.map(position => (
        <Button
          key={position}
          variant="tonal"
          onPress={() => showToast({ message: position, position })}
        >
          {position}
        </Button>
      ))}
    </View>
  );
};

export { ToastPositions };
