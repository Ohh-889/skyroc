import { Image } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

const ImageError = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Image
        className="h-20 w-20"
        radius="md"
        src={BROKEN}
      />
      <Image
        className="h-20 w-20"
        radius="md"
        src={undefined}
      />
      <Image
        showError={false}
        className="h-20 w-20"
        radius="md"
        src={BROKEN}
      />
    </View>
  );
};

export { ImageError };
