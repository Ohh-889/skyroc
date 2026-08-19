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
  {
    children: (
      <Panel
        description="从这里向右滑，会越过被禁用的「审核中」"
        title="草稿"
      />
    ),
    key: 'draft',
    title: '草稿'
  },
  {
    children: (
      <Panel
        description="不会被展示"
        title="审核中"
      />
    ),
    disabled: true,
    key: 'reviewing',
    title: '审核中'
  },
  {
    children: (
      <Panel
        description="滑动落到禁用页时，会沿滑动方向回弹到最近的可用页"
        title="已发布"
      />
    ),
    key: 'published',
    title: '已发布'
  },
  {
    children: (
      <Panel
        description="不会被展示"
        title="已下架"
      />
    ),
    disabled: true,
    key: 'archived',
    title: '已下架'
  }
];

const TabsDisabled = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs items={ITEMS} />
      </View>
    </View>
  );
};

export { TabsDisabled };
