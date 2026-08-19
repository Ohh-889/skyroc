import { Image } from '@skyroc/native-ui';
import { View } from 'react-native';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

const ImageSlotClassNames = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Image
        className="h-20 w-20"
        classNames={{ error: 'bg-destructive/10', indicator: 'accent-destructive' }}
        radius="md"
        src={BROKEN}
      />
      <Image
        className="h-20 w-20"
        classNames={{ image: 'opacity-40' }}
        radius="md"
        src={SQUARE}
      />
    </View>
  );
};

export { ImageSlotClassNames };
