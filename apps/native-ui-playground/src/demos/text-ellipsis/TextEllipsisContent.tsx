import { Button, TextEllipsis } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const LONG_TEXT =
  '在南方的冬天，屋檐下的水滴会沿着瓦片的边缘缓慢聚拢，最后落进院子里那口积满青苔的水缸，一整个下午都是这样重复的声音。他坐在门槛上看着，觉得时间被拉得很长，长到足以把一件小事想上很多遍。';

const SHORT_TEXT = '一行放得下的短文本。';

const TextEllipsisContent = () => {
  const [content, setContent] = useState(LONG_TEXT);

  return (
    <View className="bg-background px-6 py-4">
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={content}
          expandText=" 展开"
          rows={2}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant={content === LONG_TEXT ? 'solid' : 'tonal'}
          onPress={() => setContent(LONG_TEXT)}
        >
          长文本
        </Button>
        <Button
          variant={content === SHORT_TEXT ? 'solid' : 'tonal'}
          onPress={() => setContent(SHORT_TEXT)}
        >
          短文本
        </Button>
      </View>
    </View>
  );
};

export { TextEllipsisContent };
