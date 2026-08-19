import { Image, Text } from '@skyroc/native-ui';
import { ActivityIndicator, View } from 'react-native';

/** 尺寸不同的远程图，用于观察加载态 */
const WIDE = 'https://picsum.photos/id/1015/600/300';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

const ImageCustomSlots = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Image
        className="h-20 w-20"
        errorSlot={<Text className="text-xs text-muted-foreground">加载失败</Text>}
        radius="md"
        src={BROKEN}
      />
      <Image
        className="h-20 w-20"
        loadingSlot={<ActivityIndicator size="large" />}
        radius="md"
        src={`${WIDE}?custom-loading`}
      />
    </View>
  );
};

export { ImageCustomSlots };
