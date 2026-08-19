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

const AvatarGroupOverflow = () => {
  return (
    <View className="items-start bg-background p-4">
      <AvatarGroup
        max={3}
        overflowProps={{
          classNames: { fallback: 'bg-primary', fallbackText: 'text-primary-foreground' },
          fallback: <Text className="font-bold">•••</Text>
        }}
      >
        {FACES.map(face => (
          <Avatar
            key={face}
            src={face}
          />
        ))}
      </AvatarGroup>
    </View>
  );
};

export { AvatarGroupOverflow };
