import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const VARIANTS = ['solid', 'tonal', 'outline', 'ghost'] as const;

const TagVariant = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {VARIANTS.map(v => (
        <Tag
          key={v}
          variant={v}
        >
          {v}
        </Tag>
      ))}
    </View>
  );
};

export { TagVariant };
