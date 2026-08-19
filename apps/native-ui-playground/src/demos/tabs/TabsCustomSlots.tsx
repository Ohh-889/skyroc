import { Tabs, Text } from '@skyroc/native-ui';
import type { TabItem } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 面板占位内容属性 */
interface PanelProps {
  /** 正文说明 */
  description: string;

  /** 面板标题 */
  title: string;
}

const Panel = (props: PanelProps) => {
  const { description, title } = props;

  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
    </View>
  );
};

const ITEMS: TabItem[] = ['设计', '研发', '测试'].map(name => ({
  children: (
    <Panel
      description="通过 classNames 覆写 tabBar / tab / tabText / indicator 各插槽"
      title={name}
    />
  ),
  key: name,
  title: name
}));

const TabsCustomSlots = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          classNames={{
            indicator: 'h-1 bg-destructive',
            tab: 'px-8 py-4',
            tabBar: 'bg-muted/40',
            tabText: 'text-base'
          }}
          items={ITEMS}
        />
      </View>
    </View>
  );
};

export { TabsCustomSlots };
