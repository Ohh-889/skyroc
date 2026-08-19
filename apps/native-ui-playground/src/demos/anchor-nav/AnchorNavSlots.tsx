import { AnchorNav, Divider, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { LIBRARY_DATA } from './shared';

const AnchorNavSlots = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center gap-2 px-4 py-3">
        <Text className="text-xs text-muted-foreground">
          当前分组：{activeIndex} · {LIBRARY_DATA[activeIndex].title}
        </Text>
        <Text className="flex-1 text-right text-xs text-muted-foreground">滚动列表可观察高亮联动</Text>
      </View>

      <Divider className="my-0" />

      <View className="flex-1">
        <AnchorNav
          haptic={false}
          itemHeight={52}
          items={LIBRARY_DATA}
          sectionHeaderHeight={40}
          sticky={false}
          classNames={{
            content: 'bg-secondary',
            item: 'mx-2 rounded-xl bg-background px-4',
            itemText: 'text-sm font-medium text-primary',
            sectionHeader: 'bg-primary/10 px-4',
            sectionHeaderText: 'text-sm font-semibold text-primary',
            separator: 'mx-0 my-0 opacity-0',
            sidebar: 'w-24 bg-primary/5'
          }}
          sidebarClassNames={{
            indicator: 'h-8 w-1 rounded-sm bg-destructive',
            itemText: 'text-xs'
          }}
          onIndexChange={setActiveIndex}
        />
      </View>
    </View>
  );
};

export { AnchorNavSlots };
