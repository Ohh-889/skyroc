import { Button, TextEllipsis } from '@skyroc/native-ui';
import type { TextEllipsisRef } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

const LONG_TEXT =
  '在南方的冬天，屋檐下的水滴会沿着瓦片的边缘缓慢聚拢，最后落进院子里那口积满青苔的水缸，一整个下午都是这样重复的声音。他坐在门槛上看着，觉得时间被拉得很长，长到足以把一件小事想上很多遍。';

const TextEllipsisImperative = () => {
  const manualRef = useRef<TextEllipsisRef>(null);

  return (
    <View className="bg-background p-4">
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          ref={manualRef}
          rows={2}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.toggle(true)}
        >
          展开
        </Button>
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.toggle(false)}
        >
          收起
        </Button>
        <Button
          variant="outline"
          onPress={() => manualRef.current?.toggle()}
        >
          切换
        </Button>
      </View>
    </View>
  );
};

export { TextEllipsisImperative };
