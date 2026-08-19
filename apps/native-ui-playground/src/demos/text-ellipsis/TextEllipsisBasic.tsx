import { TextEllipsis } from '@skyroc/native-ui';
import { View } from 'react-native';

const LONG_TEXT =
  '在南方的冬天，屋檐下的水滴会沿着瓦片的边缘缓慢聚拢，最后落进院子里那口积满青苔的水缸，一整个下午都是这样重复的声音。他坐在门槛上看着，觉得时间被拉得很长，长到足以把一件小事想上很多遍。';

const TextEllipsisBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <TextEllipsis content={LONG_TEXT} />
      <TextEllipsis
        content={LONG_TEXT}
        rows={3}
      />
    </View>
  );
};

export { TextEllipsisBasic };
