import { Avatar, AvatarGroup } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 固定 seed，避免每次刷新拿到不同的示例图片 */
const FACES = [
  'https://picsum.photos/seed/av1/100',
  'https://picsum.photos/seed/av2/100',
  'https://picsum.photos/seed/av3/100',
  'https://picsum.photos/seed/av4/100',
  'https://picsum.photos/seed/av5/100'
];

/** DNS 解析失败的地址，用于稳定触发 fallback */
const BROKEN = 'https://invalid-url.test/broken.jpg';

const AvatarGroupBasic = () => {
  return (
    <View className="items-start gap-5 bg-background p-4">
      <AvatarGroup>
        {FACES.map(face => (
          <Avatar
            key={face}
            src={face}
          />
        ))}
      </AvatarGroup>
      <AvatarGroup>
        <Avatar src={FACES[0]} />
        <Avatar
          classNames={{ fallback: 'bg-primary', fallbackText: 'text-primary-foreground' }}
          fallback="张"
        />
        <Avatar
          fallback="坏"
          src={BROKEN}
        />
        <Avatar src={FACES[3]} />
      </AvatarGroup>
    </View>
  );
};

export { AvatarGroupBasic };
