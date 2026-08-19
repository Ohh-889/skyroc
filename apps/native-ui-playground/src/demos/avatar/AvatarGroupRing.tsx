import { Avatar, AvatarGroup, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACES = [
  'https://picsum.photos/seed/av1/100',
  'https://picsum.photos/seed/av2/100',
  'https://picsum.photos/seed/av3/100',
  'https://picsum.photos/seed/av4/100',
  'https://picsum.photos/seed/av5/100'
];

const AvatarGroupRing = () => {
  return (
    <View className="gap-4 bg-muted p-4">
      <View className="flex-row items-center gap-3">
        <AvatarGroup max={4}>
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
        <Text className="text-xs text-muted-foreground">默认 ring</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <AvatarGroup
          classNames={{ ring: 'border-muted' }}
          max={4}
        >
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
        <Text className="text-xs text-muted-foreground">border-muted</Text>
      </View>
    </View>
  );
};

export { AvatarGroupRing };
