import { Image, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const RADIUSES = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const;

const SQUARE = 'https://picsum.photos/id/1025/400/400';

const ImageRadius = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      {RADIUSES.map(radius => (
        <View
          className="items-center gap-1.5"
          key={radius}
        >
          <Image
            className="h-16 w-16"
            radius={radius}
            src={SQUARE}
          />
          <Text className="text-xs text-muted-foreground">{radius}</Text>
        </View>
      ))}
    </View>
  );
};

export { ImageRadius };
