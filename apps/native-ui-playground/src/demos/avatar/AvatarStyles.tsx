import { Avatar } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACE = 'https://picsum.photos/seed/av5/100';

const AvatarStyles = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-4 bg-background p-4">
      <Avatar
        classNames={{ fallback: 'bg-primary', fallbackText: 'text-primary-foreground' }}
        fallback="A"
      />
      <Avatar
        classNames={{ fallback: 'bg-destructive', fallbackText: 'text-destructive-foreground' }}
        fallback="B"
      />
      <Avatar
        classNames={{ fallback: 'bg-success', fallbackText: 'text-success-foreground' }}
        fallback="C"
      />
      <Avatar
        className="rounded-lg"
        classNames={{ image: 'rounded-lg' }}
        src={FACE}
      />
    </View>
  );
};

export { AvatarStyles };
