import { Text, TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectChild, TreeSelectItem } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const EVENT_ITEMS: TreeSelectItem[] = [
  {
    children: [
      { id: 'fruit-apple', text: '苹果' },
      { id: 'fruit-orange', text: '橙子' }
    ],
    id: 'fruit',
    text: '水果'
  },
  {
    children: [
      { id: 'drink-water', text: '水' },
      { disabled: true, id: 'drink-tea', text: '茶（禁用）' }
    ],
    id: 'drink',
    text: '饮品'
  }
];

const TreeSelectEvents = () => {
  const [navEvent, setNavEvent] = useState('尚未点击分组');
  const [itemEvent, setItemEvent] = useState('尚未点击子项');

  function handleClickItem(item: TreeSelectChild) {
    setItemEvent(`onClickItem：${item.id}`);
  }

  return (
    <View className="gap-2 bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          defaultActiveId="fruit-apple"
          height={220}
          items={EVENT_ITEMS}
          onClickItem={handleClickItem}
          onClickNav={index => setNavEvent(`onClickNav：${index}`)}
        />
      </View>
      <Text className="text-sm text-muted-foreground">{navEvent}</Text>
      <Text className="text-sm text-muted-foreground">{itemEvent}</Text>
    </View>
  );
};

export { TreeSelectEvents };
