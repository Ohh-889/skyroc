import { Button, Text, TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectActiveId, TreeSelectItem } from '@skyroc/native-ui';
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

/** 把选中值渲染成一行文本 */
function formatActiveId(activeId: TreeSelectActiveId) {
  if (Array.isArray(activeId)) return activeId.join('、') || '无';

  return activeId === null ? '无' : String(activeId);
}

const CITY_ITEMS = toItems([
  ['浙江', ['杭州', '宁波', '温州', '嘉兴', '湖州']],
  ['江苏', ['南京', '苏州', '无锡', '常州']],
  ['福建', ['福州', '厦门', '泉州']]
]);

const TreeSelectControlled = () => {
  const [activeId, setActiveId] = useState<TreeSelectActiveId>('1-0');
  const [navIndex, setNavIndex] = useState(1);

  return (
    <View className="gap-4 bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          activeId={activeId}
          items={CITY_ITEMS}
          mainActiveIndex={navIndex}
          onActiveIdChange={setActiveId}
          onMainActiveIndexChange={setNavIndex}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setNavIndex(value => Math.max(0, value - 1))}
        >
          上一组
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setNavIndex(value => Math.min(CITY_ITEMS.length - 1, value + 1))}
        >
          下一组
        </Button>
        <Button
          color="secondary"
          variant="ghost"
          onPress={() => setActiveId(null)}
        >
          清空选中
        </Button>
      </View>
      <Text className="text-sm text-muted-foreground">
        分组：{CITY_ITEMS[navIndex].text} / 选中：{formatActiveId(activeId)}
      </Text>
    </View>
  );
};

export { TreeSelectControlled };
