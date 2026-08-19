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

const ITEMS: TabItem[] = [
  '前端工程',
  '客户端',
  '人工智能',
  '后端开发',
  '数据分析',
  '音视频',
  '安全攻防',
  '产品设计'
].map(name => ({
  children: (
    <Panel
      description="tab 总宽超出容器时 tabBar 可横向滚动，激活项会自动居中"
      title={name}
    />
  ),
  key: name,
  title: name
}));

const TabsScrollable = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          defaultActiveIndex={4}
          items={ITEMS}
        />
      </View>
    </View>
  );
};

export { TabsScrollable };
