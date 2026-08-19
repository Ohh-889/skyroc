import { Button, Text, TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectItem } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 把「分组名 + 子项名」的简写转成 items，子项 id 用「组序号-项序号」保证全局唯一 */
function toItems(groups: [string, string[]][]): TreeSelectItem[] {
  return groups.map(([text, children], groupIndex) => ({
    children: children.map((childText, childIndex) => ({
      id: `${groupIndex}-${childIndex}`,
      text: childText
    })),
    id: text,
    text
  }));
}

/** 分组会被裁短，用来验证 items 变短后激活索引自动收敛，不会留下空白右栏 */
const SHRINK_ITEMS = toItems([
  ['第一组', ['A1', 'A2']],
  ['第二组', ['B1', 'B2']],
  ['第三组', ['C1', 'C2']],
  ['第四组', ['D1', 'D2']]
]);

const TreeSelectDynamicItems = () => {
  const [groupCount, setGroupCount] = useState(SHRINK_ITEMS.length);

  const shrinkItems = SHRINK_ITEMS.slice(0, groupCount);

  return (
    <View className="gap-4 bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          height={200}
          items={shrinkItems}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setGroupCount(count => Math.max(0, count - 1))}
        >
          删掉最后一组
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setGroupCount(count => Math.min(SHRINK_ITEMS.length, count + 1))}
        >
          加回一组
        </Button>
        <Text className="text-sm text-muted-foreground">当前 {groupCount} 组</Text>
      </View>
    </View>
  );
};

export { TreeSelectDynamicItems };
