import { Text, TreeSelect } from '@skyroc/native-ui';
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

const CUSTOM_ITEMS = toItems([
  ['设计', []],
  ['研发', []],
  ['测试', []]
]);

const TreeSelectCustomContent = () => {
  const [navIndex, setNavIndex] = useState(0);

  return (
    <View className="gap-2 bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          height={220}
          items={CUSTOM_ITEMS}
          renderContent={(item, index) => (
            <View className="flex-1 items-center justify-center gap-2 p-4">
              <Text className="text-base font-semibold">{item.text}</Text>
              <Text className="text-center text-sm text-muted-foreground">第 {index + 1} 个分组的自定义内容</Text>
            </View>
          )}
          onClickNav={setNavIndex}
        />
      </View>
      <Text className="text-sm text-muted-foreground">最近点击的分组下标：{navIndex}</Text>
    </View>
  );
};

export { TreeSelectCustomContent };
