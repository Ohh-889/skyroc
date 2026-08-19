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

const ITEMS: TabItem[] = ['概览', '明细'].map(name => ({
  children: (
    <Panel
      description="关闭 swipeable 后只能点击切换，面板改用 display 切换"
      title={name}
    />
  ),
  key: name,
  title: name
}));

const TabsSwipeDisabled = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          items={ITEMS}
          swipeable={false}
          type="pill"
        />
      </View>
    </View>
  );
};

export { TabsSwipeDisabled };
