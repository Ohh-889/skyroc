import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const COLORS = ['primary', 'destructive', 'secondary', 'success', 'warning', 'info'] as const;

const TagColorGhost = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {COLORS.map(c => (
        <Tag
          key={c}
          color={c}
          variant="ghost"
        >
          {c}
        </Tag>
      ))}
    </View>
  );
};

export { TagColorGhost };
