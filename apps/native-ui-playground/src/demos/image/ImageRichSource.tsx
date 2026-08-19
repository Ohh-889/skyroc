import { Image, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const WIDE = 'https://picsum.photos/id/1015/600/300';

const SQUARE = 'https://picsum.photos/id/1025/400/400';

const ImageRichSource = () => {
  return (
    <View className="flex-row flex-wrap items-start gap-4 bg-background p-4">
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20"
          radius="md"
          src={[
            { height: 200, uri: 'https://picsum.photos/id/1025/200/200', width: 200 },
            { height: 400, uri: SQUARE, width: 400 }
          ]}
        />
        <Text className="text-xs text-muted-foreground">多分辨率 source</Text>
      </View>
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20"
          placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
          radius="md"
          src={`${WIDE}?blurhash`}
          transition={600}
        />
        <Text className="text-xs text-muted-foreground">placeholder + transition</Text>
      </View>
    </View>
  );
};

export { ImageRichSource };
