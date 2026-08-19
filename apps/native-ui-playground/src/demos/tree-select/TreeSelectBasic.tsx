import { Text, TreeSelect } from '@skyroc/native-ui';
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

const TreeSelectBasic = () => {
  const [city, setCity] = useState<TreeSelectActiveId>('0-0');

  return (
    <View className="gap-2 bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          activeId={city}
          items={CITY_ITEMS}
          onActiveIdChange={setCity}
        />
      </View>
      <Text className="text-sm text-muted-foreground">当前选中：{formatActiveId(city)}</Text>
    </View>
  );
};

export { TreeSelectBasic };
