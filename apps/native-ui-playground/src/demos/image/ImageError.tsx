import { Image, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

const ImageError = () => {
  return (
    <View className="flex-row flex-wrap items-start gap-4 bg-background p-4">
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20"
          radius="md"
          src={BROKEN}
        />
        <Text className="text-xs text-muted-foreground">加载失败</Text>
      </View>
      <View className="items-center gap-1.5">
        <Image
          className="h-20 w-20"
          radius="md"
          src={undefined}
        />
        <Text className="text-xs text-muted-foreground">空 src</Text>
      </View>
      <View className="items-center gap-1.5">
        <Image
          showError={false}
          className="h-20 w-20 border border-dashed border-border bg-muted/20"
          radius="md"
          src={BROKEN}
        />
        <Text className="text-xs text-muted-foreground">关闭占位</Text>
      </View>
    </View>
  );
};

export { ImageError };
