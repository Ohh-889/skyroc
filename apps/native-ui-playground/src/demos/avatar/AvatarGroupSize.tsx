import { Avatar, AvatarGroup, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACES = [
  'https://picsum.photos/seed/av1/100',
  'https://picsum.photos/seed/av2/100',
  'https://picsum.photos/seed/av3/100',
  'https://picsum.photos/seed/av4/100'
];

const AvatarGroupSize = () => {
  return (
    <View className="items-start gap-4 bg-background p-4">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <View
          className="flex-row items-center gap-3"
          key={size}
        >
          <AvatarGroup size={size}>
            {FACES.map(face => (
              <Avatar
                key={face}
                src={face}
              />
            ))}
          </AvatarGroup>
          <Text className="text-xs text-muted-foreground">size={size}</Text>
        </View>
      ))}
      <View className="flex-row items-center gap-3">
        <AvatarGroup size="sm">
          <Avatar src={FACES[0]} />
          <Avatar
            size="lg"
            src={FACES[1]}
          />
          <Avatar src={FACES[2]} />
        </AvatarGroup>
        <Text className="text-xs text-muted-foreground">子项覆盖为 lg</Text>
      </View>
    </View>
  );
};

export { AvatarGroupSize };
