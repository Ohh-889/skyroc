import { Sidebar, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const CUSTOM_ITEMS = ['设计', '研发', '测试'].map(title => ({ key: title, title }));

/** 右侧内容区属性 */
interface PanelProps {
  /** 正文说明 */
  description: string;

  /** 面板标题 */
  title: string;
}

const Panel = (props: PanelProps) => {
  const { description, title } = props;

  return (
    <View className="flex-1 items-center justify-center gap-2 p-4">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
    </View>
  );
};

const SidebarCustomSlots = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch bg-muted/40"
          classNames={{
            content: 'py-2',
            indicator: 'h-10 w-1.5 rounded-sm bg-destructive',
            item: 'px-6 py-6',
            itemText: 'text-base',
            root: 'border-r border-destructive/20'
          }}
          items={CUSTOM_ITEMS}
        />
        <Panel
          description="root / content / indicator / item / itemText 均可独立覆写"
          title="自定义插槽"
        />
      </View>
    </View>
  );
};

export { SidebarCustomSlots };
