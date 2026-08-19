import { Button, Text, TextEllipsis } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const LONG_TEXT =
  '在南方的冬天，屋檐下的水滴会沿着瓦片的边缘缓慢聚拢，最后落进院子里那口积满青苔的水缸，一整个下午都是这样重复的声音。他坐在门槛上看着，觉得时间被拉得很长，长到足以把一件小事想上很多遍。';

const TextEllipsisControlled = () => {
  const [controlledExpanded, setControlledExpanded] = useState(false);

  return (
    <View className="bg-background p-4">
      <View className="mb-4">
        <TextEllipsis
          collapseText=" 收起"
          content={LONG_TEXT}
          expandText=" 展开"
          expanded={controlledExpanded}
          rows={2}
          onExpandedChange={setControlledExpanded}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setControlledExpanded(prev => !prev)}
        >
          {controlledExpanded ? '外部收起' : '外部展开'}
        </Button>
        <Text color="muted">expanded：{String(controlledExpanded)}</Text>
      </View>
    </View>
  );
};

export { TextEllipsisControlled };
