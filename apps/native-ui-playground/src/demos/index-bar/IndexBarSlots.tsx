import { Divider, IndexBar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { CITY_ITEMS } from './shared';

const IndexBarSlots = () => {
  const [activeIndex, setActiveIndex] = useState(CITY_ITEMS[0].title);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 py-3">
        <Text className="text-xs text-muted-foreground">当前索引：{activeIndex}</Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <IndexBar
          haptic={false}
          itemHeight={52}
          items={CITY_ITEMS}
          sectionHeaderHeight={40}
          sticky={false}
          classNames={{
            // 索引条加宽了，列表的右内边距要跟着加宽，否则文字会钻到字母底下
            content: 'bg-secondary pr-10',
            item: 'mx-2 rounded-xl bg-background px-4',
            itemText: 'text-sm font-medium text-primary',
            sectionHeader: 'bg-primary/10 px-4',
            sectionHeaderText: 'text-sm font-semibold text-primary',
            // 只把线藏起来，不动高度：分隔线的占位是滚动定位的度量之一
            separator: 'mx-0 my-0 opacity-0',
            sidebar: 'w-10',
            sidebarItem: 'h-6 w-6',
            // 只放大字号，颜色留给 active 变体去决定，覆盖了就分不出激活态了
            sidebarItemText: 'text-sm'
          }}
          onIndexChange={setActiveIndex}
        />
      </View>
    </View>
  );
};

export { IndexBarSlots };
