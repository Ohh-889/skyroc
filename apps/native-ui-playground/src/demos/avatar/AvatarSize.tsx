import { Avatar, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const AvatarSize = () => {
  return (
    <View className="flex-row flex-wrap items-end gap-4 bg-background p-4">
      {SIZES.map(size => (
        <View
          className="items-center gap-1.5"
          key={size}
        >
          <Avatar
            fallback="AB"
            size={size}
          />
          <Text className="text-xs text-muted-foreground">{size}</Text>
        </View>
      ))}
    </View>
  );
};

export { AvatarSize };
