import { Image, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const FITS = ['cover', 'contain', 'fill', 'none'] as const;

/** 宽图放进方形容器，才能看出 contentFit 的差异 */
const WIDE = 'https://picsum.photos/id/1015/600/300';

const ImageContentFit = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      {FITS.map(fit => (
        <View
          className="items-center gap-1"
          key={fit}
        >
          <Image
            className="h-16 w-16"
            contentFit={fit}
            radius="md"
            src={WIDE}
          />
          <Text className="text-xs text-muted-foreground">{fit}</Text>
        </View>
      ))}
    </View>
  );
};

export { ImageContentFit };
