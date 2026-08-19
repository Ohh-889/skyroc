import { Button, Image, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 必然 404 的地址，用于触发失败占位 */
const BROKEN = 'https://picsum.photos/this-path-does-not-exist.jpg';

/** 每次点击都换一张新图，用来验证换图时加载态会被重置 */
const GALLERY = [
  'https://picsum.photos/id/1025/400/400',
  'https://picsum.photos/id/1015/600/300',
  'https://picsum.photos/id/1035/400/400',
  BROKEN
];

const ImageSwitchSource = () => {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('等待加载');

  function handleLoad() {
    setStatus('onLoad：加载成功');
  }

  function handleError() {
    setStatus('onError：加载失败');
  }

  function handleNext() {
    setStatus('等待加载');
    setIndex(previous => (previous + 1) % GALLERY.length);
  }

  return (
    <View className="items-start gap-3 bg-background p-4">
      <Image
        className="h-32 w-32"
        radius="lg"
        src={GALLERY[index]}
        onError={handleError}
        onLoad={handleLoad}
      />
      <Text className="text-xs text-muted-foreground">
        {index + 1} / {GALLERY.length}
        {GALLERY[index] === BROKEN ? '（这张是坏图）' : ''}
      </Text>
      <Text className="text-sm text-foreground">{status}</Text>
      <Button
        color="primary"
        variant="solid"
        onPress={handleNext}
      >
        下一张
      </Button>
    </View>
  );
};

export { ImageSwitchSource };
