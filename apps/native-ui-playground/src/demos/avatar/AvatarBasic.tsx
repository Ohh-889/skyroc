import { Avatar, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACE = 'https://picsum.photos/seed/av1/100';

const AvatarBasic = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Avatar
        alt="示例用户头像"
        src={FACE}
      />
      <Avatar fallback="张" />
      <Avatar fallback={7} />
      <Avatar fallback={<Text className="text-xs font-semibold text-primary">VIP</Text>} />
    </View>
  );
};

export { AvatarBasic };
