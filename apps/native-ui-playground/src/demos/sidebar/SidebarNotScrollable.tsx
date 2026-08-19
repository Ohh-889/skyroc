import { Sidebar, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const STATIC_ITEMS = ['概览', '明细', '设置'].map(title => ({ key: title, title }));

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

const SidebarNotScrollable = () => {
  return (
    <View className="bg-background p-4">
      <View className="flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          items={STATIC_ITEMS}
          scrollable={false}
        />
        <Panel
          description="这一块没有固定高度，由侧边栏自身内容撑开"
          title="随内容撑开"
        />
      </View>
    </View>
  );
};

export { SidebarNotScrollable };
