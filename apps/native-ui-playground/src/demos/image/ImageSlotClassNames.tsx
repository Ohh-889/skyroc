import { Image, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

const ImageSlotClassNames = () => {
  return (
    <View className="flex-row flex-wrap items-start gap-4 bg-background p-4">
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20"
          classNames={{ error: 'bg-destructive/10', indicator: 'accent-destructive' }}
          radius="md"
          src={BROKEN}
        />
        <Text className="text-xs text-muted-foreground">error / indicator</Text>
      </View>
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20 border-2 border-primary"
          classNames={{ image: 'opacity-40' }}
          radius="md"
          src={SQUARE}
        />
        <Text className="text-xs text-muted-foreground">root / image</Text>
      </View>
    </View>
  );
};

export { ImageSlotClassNames };
