import { Image } from '@skyroc/native-ui';
import { View } from 'react-native';

const WIDE = 'https://picsum.photos/id/1015/600/300';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

const ImageRichSource = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Image
        className="h-20 w-20"
        radius="md"
        src={[
          { height: 200, uri: 'https://picsum.photos/id/1025/200/200', width: 200 },
          { height: 400, uri: SQUARE, width: 400 }
        ]}
      />
      <Image
        className="h-20 w-20"
        placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
        radius="md"
        src={`${WIDE}?blurhash`}
      />
    </View>
  );
};

export { ImageRichSource };
