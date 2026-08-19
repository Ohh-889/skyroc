import { Cell } from '@skyroc/native-ui';
import { View } from 'react-native';

const CellSize = () => {
  return (
    <View className="bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          size="sm"
          subtitle="Small"
          title="紧凑尺寸"
        />
        <Cell
          size="md"
          subtitle="Medium"
          title="默认尺寸"
        />
        <Cell
          size="lg"
          subtitle="Large"
          title="宽松尺寸"
        />
      </View>
    </View>
  );
};

export { CellSize };
