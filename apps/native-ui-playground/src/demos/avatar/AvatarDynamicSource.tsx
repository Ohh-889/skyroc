import { Avatar, Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** DNS 解析失败的地址，用于稳定触发 fallback */
const BROKEN = 'https://invalid-url.test/broken.jpg';

/** 包含正常图片与坏图，用于验证 src 变化后失败状态能够恢复 */
const GALLERY = [
  'https://picsum.photos/seed/av1/100',
  BROKEN,
  'https://picsum.photos/seed/av3/100',
  'https://picsum.photos/seed/av4/100'
];

const AvatarDynamicSource = () => {
  const [index, setIndex] = useState(0);

  return (
    <View className="items-start gap-3 bg-background p-4">
      <Avatar
        fallback="?"
        size="2xl"
        src={GALLERY[index]}
      />
      <Text className="text-sm text-muted-foreground">
        当前图片：{index + 1} / {GALLERY.length}
        {GALLERY[index] === BROKEN ? '（坏图，下一张应恢复）' : ''}
      </Text>
      <Button
        variant="outline"
        onPress={() => setIndex(previous => (previous + 1) % GALLERY.length)}
      >
        切换图片
      </Button>
    </View>
  );
};

export { AvatarDynamicSource };
