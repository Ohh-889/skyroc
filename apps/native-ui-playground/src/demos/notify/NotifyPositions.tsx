import type { NotifyPosition } from '@skyroc/native-ui';
import { Button, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const POSITIONS: NotifyPosition[] = ['top', 'bottom'];

const NotifyPositions = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {POSITIONS.map(position => (
        <Button
          key={position}
          variant="tonal"
          onPress={() => showNotify({ message: `贴 ${position} 显示`, position })}
        >
          {position}
        </Button>
      ))}
    </View>
  );
};

export { NotifyPositions };
