import { Image } from '@skyroc/native-ui';
import { View } from 'react-native';

const RADIUSES = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const;

const SQUARE = 'https://picsum.photos/id/1025/400/400';

const ImageRadius = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      {RADIUSES.map(radius => (
        <Image
          className="h-16 w-16"
          key={radius}
          radius={radius}
          src={SQUARE}
        />
      ))}
    </View>
  );
};

export { ImageRadius };
