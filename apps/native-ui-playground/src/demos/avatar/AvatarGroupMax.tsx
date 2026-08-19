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

const AvatarGroupMax = () => {
  return (
    <View className="items-start gap-4 bg-background p-4">
      <View className="flex-row items-center gap-3">
        <AvatarGroup max={2}>
          {FACES.map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
        <Text className="text-xs text-muted-foreground">max=2</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <AvatarGroup max={0}>
          {FACES.slice(0, 4).map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
        <Text className="text-xs text-muted-foreground">max=0（全部）</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <AvatarGroup total={20}>
          {FACES.slice(0, 3).map(face => (
            <Avatar
              key={face}
              src={face}
            />
          ))}
        </AvatarGroup>
        <Text className="text-xs text-muted-foreground">total=20（+17）</Text>
      </View>
    </View>
  );
};

export { AvatarGroupMax };
