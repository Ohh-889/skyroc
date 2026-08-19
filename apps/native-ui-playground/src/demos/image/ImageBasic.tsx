import { Image } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 尺寸不同的远程图，用于观察不同宽高比下的表现 */
const WIDE = 'https://picsum.photos/id/1015/600/300';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

const ImageBasic = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Image
        className="h-20 w-20"
        src={SQUARE}
      />
      <Image
        className="h-20 w-32"
        src={WIDE}
      />
    </View>
  );
};

export { ImageBasic };
