import { Image, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const WIDE = 'https://picsum.photos/id/1015/600/300';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

const ImageBasic = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20"
          src={SQUARE}
        />
        <Text className="text-xs text-muted-foreground">方形尺寸</Text>
      </View>
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-32"
          src={WIDE}
        />
        <Text className="text-xs text-muted-foreground">横向尺寸</Text>
      </View>
    </View>
  );
};

export { ImageBasic };
