import { Avatar } from '@skyroc/native-ui';
import { View } from 'react-native';

/** DNS 解析失败的地址，用于稳定触发 fallback */
const BROKEN = 'https://invalid-url.test/broken.jpg';

const AvatarFallback = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Avatar
        fallback="坏"
        src={BROKEN}
      />
      <Avatar
        fallback="空"
        src={undefined}
      />
      <Avatar
        alt="王小明的头像"
        fallback="王"
        src={BROKEN}
      />
      <Avatar />
    </View>
  );
};

export { AvatarFallback };
