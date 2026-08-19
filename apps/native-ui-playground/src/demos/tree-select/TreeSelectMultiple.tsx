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

const TAG_ITEMS = toItems([
  ['口味', ['麻辣', '清淡', '酸甜', '咸鲜']],
  ['菜系', ['川菜', '粤菜', '徽菜']],
  ['忌口', ['不吃香菜', '不吃葱', '不吃辣']]
]);

const MAX_COUNT = 3;

const TreeSelectMultiple = () => {
  const [tags, setTags] = useState<TreeSelectActiveId>(['0-0', '1-1']);

  const selectedTagCount = Array.isArray(tags) ? tags.length : 0;

  return (
    <View className="gap-2 bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          multiple
          activeId={tags}
          items={TAG_ITEMS}
          max={MAX_COUNT}
          onActiveIdChange={setTags}
        />
      </View>
      <Text className="text-sm text-muted-foreground">
        已选 {selectedTagCount} / {MAX_COUNT}：{formatActiveId(tags)}
      </Text>
    </View>
  );
};

export { TreeSelectMultiple };
