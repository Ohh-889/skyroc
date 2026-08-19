import type { SidebarItem } from '@skyroc/native-ui';
import { Sidebar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CUSTOM_TITLE_ITEMS: SidebarItem[] = [
  {
    key: 'new',
    title: (
      <View className="items-center">
        <Text className="text-sm font-medium">新品</Text>
        <Text className="text-xs text-primary">NEW</Text>
      </View>
    )
  },
  {
    key: 'sale',
    title: (
      <View className="items-center">
        <Text className="text-sm font-medium">促销</Text>
        <Text className="text-xs text-destructive">SALE</Text>
      </View>
    )
  },
  { key: 'all', title: '全部' }
];

const SidebarCustomTitle = () => {
  const [activeKey, setActiveKey] = useState(CUSTOM_TITLE_ITEMS[0].key);

  function handleIndexChange(_index: number, item: SidebarItem) {
    setActiveKey(item.key);
  }

  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          items={CUSTOM_TITLE_ITEMS}
          onIndexChange={handleIndexChange}
        />
        <View className="flex-1 items-center justify-center gap-2 p-4">
          <Text className="text-base font-semibold">当前 key：{activeKey}</Text>
          <Text className="text-center text-sm text-muted-foreground">title 可直接传入自定义节点</Text>
        </View>
      </View>
    </View>
  );
};

export { SidebarCustomTitle };
